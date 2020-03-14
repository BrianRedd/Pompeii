/** @module MainContainer */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../redux/Actions";
import * as types from "../types/types";
import * as constant from "../data/constants";
import {
  gridByColor,
  voidLavaSquares,
  voidRunSquares,
  escapeSquares,
  gateSquares
} from "../data/gridData";

import Main from "./Main";

const mapStateToProps = state => {
  return {
    ...state
  };
};

const mapDispatchToProps = {
  ...actions
};

/**
 * @function MainContainer
 * @description Functional Container component for Main
 * @returns {React.Component} - Rendered component.
 */
const MainContainer = props => {
  const {
    cardsState,
    flagsState,
    gridState,
    messageState,
    playersState,
    tileState,
    toggleFlags,
    takeCard,
    discardCard,
    takeTile,
    incrementPlayerTurn,
    incrementPlayerSaved,
    updatePlayerHand,
    updateInstructions,
    placePeopleInSquare,
    incrementStage,
    incrementPlayerPopulation,
    incrementPlayerCasualties,
    placeLavaTileOnSquare,
    setRunCounter,
    addSnackbar
  } = props;

  const numberOfEruptionTurns = 6;

  const [activePlayer, setActivePlayer] = useState();

  useEffect(() => {
    setActivePlayer(_.get(playersState, `players[${playersState.turn}]`));
  }, [playersState]);

  const [cardGrid, setCardGrid] = useState([]);

  const [numberOfRelatives, setNumberOfRelatives] = useState(0);
  const [placedRelatives, setPlacedRelatives] = useState([]);

  const [readyForSacrifice, setReadyForSacrifice] = useState(false);

  const [lavaTile, setLavaTile] = useState();
  const [dangerZone, setDangerZone] = useState([]);

  const [initialEruptionCounter, setInitialEruptionCounter] = useState(
    numberOfEruptionTurns
  );

  const [runZone, setRunZone] = useState([]);
  const [runFromSquare, setRunFromSquare] = useState();
  const [runner, setRunner] = useState();

  /**
   * @function placeRelatives
   * @description function when relatives is placed
   * @param {String} grid - grid where "parent" was placed
   */
  const placeRelatives = grid => {
    console.log("placeRelatives; grid:", grid);
    // current other occupants
    const currentOccupants = _.get(gridState, `grid.${grid}.occupants`, []);
    let thisPlacedRelatives = placedRelatives;

    if (grid) {
      // place relative in square
      placePeopleInSquare(grid, [
        ...currentOccupants,
        {
          player: activePlayer,
          gender: Math.round(Math.random()) ? "male" : "female"
        }
      ]);
      incrementPlayerPopulation(activePlayer, 1);
      thisPlacedRelatives = [...placedRelatives, grid];
      setPlacedRelatives(thisPlacedRelatives);
      setCardGrid([...cardGrid].filter(val => val !== grid));
    }

    // if enough relatives have been placed, end relative placement
    if (thisPlacedRelatives.length === numberOfRelatives || !grid) {
      setNumberOfRelatives(0);
      setPlacedRelatives([]);
      setCardGrid([]);
      if (flagsState.flags.includes("placing-person")) {
        toggleFlags("placing-person");
      }
      updateInstructions({
        text: `${_.get(playersState, `details.${activePlayer}.name`)}: ${
          constant.DRAW
        }`,
        color: _.get(playersState, `details.${activePlayer}.color`)
      });
    }
  };

  /**
   * @function placePerson
   * @description function when person is placed
   * @param {String} grid
   */
  const placePerson = grid => {
    console.log("placePerson; grid:", grid);
    // if number of relatives is set, place relative instead
    if (numberOfRelatives > 0) {
      placeRelatives(grid);
      return;
    }

    // current other occupants
    const currentOccupants = _.get(gridState, `grid.${grid}.occupants`, []);

    // place person in square
    placePeopleInSquare(grid, [
      ...currentOccupants,
      {
        player: activePlayer,
        gender: Math.round(Math.random()) ? "male" : "female"
      }
    ]);
    incrementPlayerPopulation(activePlayer, 1);

    // if there should be relatives, set relative states
    if (
      messageState.stage === 1 &&
      currentOccupants.length > 0 &&
      numberOfRelatives === 0 &&
      !flagsState.flags.includes("card-wild")
    ) {
      setNumberOfRelatives(currentOccupants.length);
      setPlacedRelatives([]);
      const newGridArray = _.uniq([
        ...cardGrid,
        ...gridByColor.White,
        ...gridByColor[
          _.get(gridState, `grid.${grid}.buildingName`, "").split(" ")[0]
        ]
      ]).filter(val => val !== grid);
      setCardGrid(newGridArray);
      updateInstructions({
        text: `${_.get(playersState, `details.${activePlayer}.name`)}: ${
          constant.RELATIVE
        }`,
        color: _.get(playersState, `details.${activePlayer}.color`)
      });
    } else {
      // else complete placement
      setCardGrid([]);
      if (flagsState.flags.includes("placing-person")) {
        toggleFlags("placing-person");
      }
      if (flagsState.flags.includes("card-wild")) {
        toggleFlags("card-wild");
      }
      updateInstructions({
        text: `${_.get(playersState, `details.${activePlayer}.name`)}: ${
          constant.DRAW
        }`,
        color: _.get(playersState, `details.${activePlayer}.color`)
      });
    }
  };

  /**
   * @function vacancy
   * @description checks for vacancy within a square
   * @param {String} square
   * @return {Boolean}
   */
  const vacancy = square => {
    console.log("vacancy; square:", square);
    if (
      _.get(gridState, `grid.${square}.occupants.length`, 0) <
      _.get(gridState, `grid.${square}.buildingCapacity`, 0)
    ) {
      return true;
    }
    return false;
  };

  /**
   * @function playPompCard
   * @description when player plays pompeii card
   * @param {String} card
   */
  const playPompCard = card => {
    console.log("playPompCard; card:", card);
    let gridHighlights = cardsState.cards[card].grid.filter(val =>
      vacancy(val)
    );

    if (!gridHighlights.length) {
      gridHighlights = _.uniqBy([
        ...gridByColor.White,
        ...gridByColor.Grey,
        ...gridByColor.Purple,
        ...gridByColor.Turquoise,
        ...gridByColor.Brown
      ]).filter(val => vacancy(val));
      if (!flagsState.flags.includes("card-wild")) {
        toggleFlags("card-wild");
      }
    }

    if (!flagsState.flags.includes("placing-person")) {
      toggleFlags("placing-person");
    }

    setCardGrid(gridHighlights);
    updateInstructions({
      text: `${_.get(playersState, `details.${activePlayer}.name`)}: ${
        constant.PLACE
      }`,
      color: _.get(playersState, `details.${activePlayer}.color`)
    });
  };

  /**
   * @function resolveAd79
   * @description resolve AD 79 card when drawn
   */
  const resolveAd79 = () => {
    console.log("resolveAd79");
    if (!flagsState.flags.includes("card-ad79")) {
      toggleFlags("card-ad79");
    }
    setTimeout(() => {
      if (messageState.stage === 1) {
        const nextPlayer =
          (playersState.turn + 1) % playersState.players.length;
        setActivePlayer(nextPlayer);
        incrementPlayerTurn();
        updateInstructions({
          text: `${_.get(
            playersState,
            `details[${playersState.players[nextPlayer]}].name`
          )}: ${constant.LAVA_TILE}`,
          color: _.get(
            playersState,
            `details[${playersState.players[nextPlayer]}].color`
          )
        });
      }
    }, 100);
    incrementStage();
  };

  /**
   * @function performSacrifice
   * @description upon selection of person, sacrifice if not your own
   * @param {Object} personObj
   * @param {String} square
   */
  const performSacrifice = (personObj, square) => {
    console.log("performSacrifice; personObj:", personObj, "square:", square);
    if (
      !flagsState.flags.includes("card-omen") ||
      personObj.player === activePlayer
    )
      return;

    const currentOccupants = _.get(gridState, `grid.${square}.occupants`, []);

    const idx = currentOccupants
      .map(person => person.player)
      .indexOf(personObj.player);
    currentOccupants.splice(idx, 1);

    if (!readyForSacrifice) return;
    placePeopleInSquare(square, currentOccupants);
    incrementPlayerCasualties(personObj.player, 1);

    setReadyForSacrifice(false);
    if (flagsState.flags.includes("card-omen")) {
      toggleFlags("card-omen");
    }
    updateInstructions({
      text: `${_.get(playersState, `details.${activePlayer}.name`)}: ${
        constant.DRAW
      }`,
      color: _.get(playersState, `details.${activePlayer}.color`)
    });
  };

  /**
   * @function resolveOmen
   * @description resolve Omen card when drawn - sacrifice another player's person
   */
  const resolveOmen = () => {
    console.log("resolveOmen");
    setReadyForSacrifice(true);
    updateInstructions({
      text: `${_.get(playersState, `details.${activePlayer}.name`)}: ${
        constant.SACRIFICE
      }`,
      color: _.get(playersState, `details.${activePlayer}.color`)
    });
    if (!flagsState.flags.includes("card-omen")) {
      toggleFlags("card-omen");
    }
  };

  /**
   * @function drawCard
   * @description draw card from deck
   */
  const drawCard = () => {
    console.log("drawCard");
    // draw card
    const takenCard = cardsState.deck[cardsState.deck.length - 1];
    takeCard();

    // check for AD79
    if (_.get(cardsState, `cards[${takenCard}].type`) === constant.AD79) {
      discardCard(takenCard);
      resolveAd79();
      return;
    }

    // check for Omen
    if (_.get(cardsState, `cards[${takenCard}].type`) === constant.OMEN) {
      discardCard(takenCard);
      resolveOmen();
      return;
    }

    const newHand = [
      ..._.get(playersState, `details.${activePlayer}.hand`),
      takenCard
    ];

    // add card to player hand
    updatePlayerHand(activePlayer, newHand);

    // next player's turn
    incrementPlayerTurn();
  };

  /**
   * @function highlightDangerZones
   * @description send list of available tiles to highlight component
   * @param {String} tile - picked lava tile
   */
  const highlightDangerZones = tile => {
    console.log("highlightDangerZones; tile:", tile);
    setLavaTile(tile);

    if (flagsState.flags.includes("placing-lava-tile")) {
      toggleFlags("placing-lava-tile");
    }
    if (flagsState.flags.includes("lava-tile")) {
      toggleFlags("lava-tile");
    }

    const hotZones = [];
    let homeVent = "";
    const gridKeys = Object.keys(gridState.grid);
    gridKeys.forEach(key => {
      if (_.get(gridState, `grid.${key}.lava`) === tile) {
        hotZones.push(key);
      }
      if (_.get(gridState, `grid.${key}.ventName`) === tile) {
        homeVent = key;
      }
    });

    if (!hotZones.length) {
      setDangerZone([homeVent]);
    } else {
      const warmZones = [];
      hotZones.forEach(zone => {
        const coord = zone.split("_");
        warmZones.push(
          `${Math.min(parseFloat(coord[0]) + 1, 6)}_${coord[1]}`,
          `${Math.max(parseFloat(coord[0]) - 1, 0)}_${coord[1]}`,
          `${coord[0]}_${Math.min(parseFloat(coord[1]) + 1, 10)}`,
          `${coord[0]}_${Math.max(parseFloat(coord[1]) - 1, 0)}`
        );
      });
      const filteredZones = _.uniqBy(
        warmZones.filter(zone => {
          return (
            !_.get(gridState, `grid.${zone}.lava`) &&
            !voidLavaSquares.includes(zone)
          );
        })
      );
      if (filteredZones.length) {
        setDangerZone(filteredZones);
      } else if (!flagsState.flags.includes("no-place-to-place")) {
        toggleFlags("no-place-to-place");
      }
    }
  };

  /**
   * @function runForYourLives
   * @description player can now run two of their people
   */
  const runForYourLives = async () => {
    console.log("runForYourLives");
    await updateInstructions({
      text: `${_.get(playersState, `details.${activePlayer}.name`)}: ${
        constant.RUN
      }`,
      color: _.get(playersState, `details.${activePlayer}.color`)
    });
  };

  /**
   * @function resolveNoPlaceToPlace
   * @description continue from no place to place
   */
  const resolveNoPlaceToPlace = () => {
    console.log("resolveNoPlaceToPlace");
    if (flagsState.flags.includes("no-place-to-place")) {
      toggleFlags("no-place-to-place");
    }
    if (flagsState.flags.includes("placing-lava-tile")) {
      toggleFlags("placing-lava-tile");
    }
    setLavaTile();
    setDangerZone([]);
    if (initialEruptionCounter) {
      setInitialEruptionCounter(initialEruptionCounter - 1);
      incrementPlayerTurn();
    } else if (_.get(playersState, `details.${activePlayer}.population`) < 1) {
      incrementPlayerTurn();
    } else {
      setRunCounter(2);
      runForYourLives();
    }
  };

  /**
   * @function drawTile
   * @description drawing a tile during stage 3
   */
  const drawTile = () => {
    console.log("drawTile");
    const tilePile = [...tileState.pile];

    // draw tile
    const takenTile = tilePile.pop();
    setLavaTile(takenTile);
    takeTile();

    const wilds = _.get(tileState, `tiles.${takenTile}.wilds`);
    if (wilds) {
      toggleFlags("wild-lava-tile");
    } else {
      highlightDangerZones(takenTile);
    }
    if (!flagsState.flags.includes("lava-tile")) {
      toggleFlags("lava-tile");
    }
  };

  /**
   * @function selectRunner
   * @description select person to run
   * @param {Object} person - person object
   * @param {String} square - square
   */
  const selectRunner = (person, square) => {
    console.log("selectRunner; person:", person, "square:", square);
    setRunner(person);

    setRunFromSquare(square);
    if (person.player !== activePlayer) {
      console.log("Not your person!");
      addSnackbar({
        message: "Not your person!",
        type: "warning"
      });
      return;
    }
    if (
      person.lastMoved === playersState.totalTurns &&
      _.get(playersState, `details.${activePlayer}.population`) !== 1
    ) {
      console.log("Already ran this person this turn!");
      addSnackbar({
        message: "Already ran this person this turn!",
        type: "warning"
      });
      return;
    }

    const pop = _.get(gridState, `grid.${square}.occupants.length`);

    const coord = square.split("_");
    const coord0 = parseFloat(coord[0]);
    const coord1 = parseFloat(coord[1]);
    const targetZones = [];

    for (let xx = pop; xx >= 0; xx -= 1) {
      for (let yy = 0; yy <= pop - xx; yy += 1) {
        targetZones.push(
          `${Math.min(coord0 + xx, 7)}_${Math.min(
            coord1 + Math.abs(pop - xx - yy),
            11
          )}`
        );
        targetZones.push(
          `${Math.max(coord0 - xx, -1)}_${Math.min(
            coord1 + Math.abs(pop - xx - yy),
            11
          )}`
        );
        targetZones.push(
          `${Math.min(coord0 + xx, 7)}_${Math.max(
            coord1 - Math.abs(pop - xx - yy),
            -1
          )}`
        );
        targetZones.push(
          `${Math.max(coord0 - xx, -1)}_${Math.max(
            coord1 - Math.abs(pop - xx - yy),
            -1
          )}`
        );
      }
    }

    setRunZone(
      _.uniqBy(
        targetZones.filter(zone => {
          return (
            zone !== square &&
            !_.get(gridState, `grid.${zone}.ventName`) &&
            !_.get(gridState, `grid.${zone}.lava`) &&
            !voidRunSquares.includes(zone)
          );
        })
      )
    );
  };

  /**
   * @function boundardDFS
   * @description DFS helper function
   * @param {Array} grid
   * @param {Number} i
   * @param {Number} j
   */
  const boundaryDFS = (grid, i, j) => {
    const thisGrid = [...grid];
    if (i > thisGrid.length - 1 || i < 0 || j > thisGrid[0].length || j < 0)
      return;

    if (thisGrid[i][j] === "O") thisGrid[i][j] = "*";

    if (i > 0 && thisGrid[i - 1][j] === "O") {
      boundaryDFS(thisGrid, i - 1, j);
    }

    if (i < thisGrid.length - 1 && thisGrid[i + 1][j] === "O") {
      boundaryDFS(thisGrid, i + 1, j);
    }

    if (j > 0 && thisGrid[i][j - 1] === "O") {
      boundaryDFS(thisGrid, i, j - 1);
    }

    if (i < thisGrid[0].length - 1 && thisGrid[i][j + 1] === "O") {
      boundaryDFS(thisGrid, i, j + 1);
    }
  };

  /**
   * @function burnSurroundedTiles
   * @description if tiles are surrounded by lava, burn 'em all
   * @param {Array} tiles
   */
  const burnSurroundedTiles = tiles => {
    tiles.forEach(tile => {
      placeLavaTileOnSquare(tile, "Lava");

      _.get(gridState, `grid.${tile}.occupants`, []).forEach(person => {
        incrementPlayerCasualties(person.player, 1);
      });
      placePeopleInSquare(tile, []);
    });
  };

  /**
   * @function checkForSurroundedTiles
   * @description DFS-based check for tiles surrounded by lava
   * @param {String} tile most recently placed tile location
   * @returns {Array} array of surrounded tiles
   */
  const checkForSurroundedTiles = tile => {
    const surroundedTiles = [];
    const tempGrid = [];
    for (let i = 0; i < 7; i += 1) {
      const row = [];
      for (let ii = 0; ii < 11; ii += 1) {
        let gridValue = _.get(gridState, `grid.${i}_${ii}.lava`) ? "L" : "O";
        if (tile === `${i}_${ii}`) gridValue = "L";
        if (voidLavaSquares.includes(`${i}_${ii}`)) {
          gridValue = "W";
        }
        if (gridValue === "O" && gateSquares.includes(`${i}_${ii}`)) {
          gridValue = "X";
        }
        row.push(gridValue);
      }
      tempGrid.push(row);
    }

    const rows = tempGrid.length;
    const columns = tempGrid[0].length;

    gateSquares.forEach(square => {
      const coords = square.split("_");
      const i = parseFloat(coords[0]);
      const j = parseFloat(coords[1]);

      if (tempGrid[i][j] === "X") boundaryDFS(tempGrid, i, j);
    });

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < columns; j += 1) {
        if (tempGrid[i][j] === "O") {
          tempGrid[i][j] = "L";
          surroundedTiles.push(`${i}_${j}`);
        } else if (tempGrid[i][j] === "*") {
          tempGrid[i][j] = "O";
        }
      }
    }
    return surroundedTiles;
  };

  /**
   * @function placeLavaTile
   * @description placing tile in highlight area
   * @param {String} square
   */
  const placeLavaTile = square => {
    console.log("placeLavaTile:", lavaTile, square);
    placeLavaTileOnSquare(square, lavaTile);

    _.get(gridState, `grid.${square}.occupants`, []).forEach(person => {
      incrementPlayerCasualties(person.player, 1);
    });
    placePeopleInSquare(square, []);

    if (flagsState.flags.includes("placing-lava-tile")) {
      toggleFlags("placing-lava-tile");
    }
    setLavaTile();
    setDangerZone([]);

    // check for tiles surrounded by lava
    const tilesSurroundedByLava = checkForSurroundedTiles(square);
    if (tilesSurroundedByLava.length > 0) {
      burnSurroundedTiles(tilesSurroundedByLava);
    }

    if (initialEruptionCounter) {
      setInitialEruptionCounter(initialEruptionCounter - 1);
      incrementPlayerTurn();
    } else if (_.get(playersState, `details.${activePlayer}.population`) < 1) {
      incrementPlayerTurn();
    } else {
      setRunCounter(2);
      runForYourLives();
    }
  };

  /**
   * @function runToSquare
   * @description handle person running from one square to another
   * @param {String} player
   * @param {String} fromSquare
   * @param {String} toSquare
   */
  const runToSquare = toSquare => {
    console.log("runToSquare; toSquare:", toSquare);
    let numberOfRuns = toSquare ? flagsState.runCounter : 0;

    if (numberOfRuns) {
      const oldSquareOccupants = _.get(
        gridState,
        `grid.${runFromSquare}.occupants`
      );
      const oldSquareIdx = oldSquareOccupants
        .map(person => person.player)
        .indexOf(activePlayer);
      oldSquareOccupants.splice(oldSquareIdx, 1);
      placePeopleInSquare(runFromSquare, oldSquareOccupants);

      if (escapeSquares.includes(toSquare)) {
        incrementPlayerSaved(activePlayer, 1);
        if (_.get(playersState, `details.${activePlayer}.population`) === 1) {
          numberOfRuns = 1;
        }
      } else {
        const newSquareOccupants = _.get(
          gridState,
          `grid.${toSquare}.occupants`
        );
        newSquareOccupants.push({
          player: activePlayer,
          gender: runner.gender,
          lastMoved:
            oldSquareOccupants.length > 0 ? playersState.totalTurns : undefined
        });
      }

      numberOfRuns -= 1;
    }
    if (_.get(playersState, `details.${activePlayer}.population`) < 1) {
      numberOfRuns = 0;
    }
    setRunCounter(numberOfRuns);
    setRunZone([]);
    setRunner();
    if (!numberOfRuns) {
      incrementPlayerTurn();
    }
  };

  return (
    <div data-test="container-main">
      <Main
        flagsState={flagsState}
        messageState={messageState}
        tileState={tileState}
        drawCard={drawCard}
        deckEnabled={
          _.get(playersState, `details.${activePlayer}.hand.length`) < 4 &&
          !flagsState.flags.includes("placing-person") &&
          !flagsState.flags.includes("card-omen")
        }
        pileEnabled={
          messageState.stage === 2 &&
          !flagsState.flags.includes("placing-lava-tile") &&
          !flagsState.runCounter
        }
        playPompCard={playPompCard}
        cardGrid={cardGrid}
        placePerson={placePerson}
        vacancy={vacancy}
        performSacrifice={performSacrifice}
        drawTile={drawTile}
        resolveNoPlaceToPlace={resolveNoPlaceToPlace}
        lavaTile={lavaTile}
        highlightDangerZones={highlightDangerZones}
        dangerZone={dangerZone}
        placeLavaTile={placeLavaTile}
        selectRunner={selectRunner}
        runZone={runZone}
        runToSquare={runToSquare}
        toggleFlags={toggleFlags}
        placeRelatives={placeRelatives}
        activePlayer={activePlayer}
      />
    </div>
  );
};

MainContainer.propTypes = {
  cardsState: types.cardsState.types,
  flagsState: types.flagsState.types,
  gridState: types.gridState.types,
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  tileState: types.tileState.types,
  toggleFlags: PropTypes.func,
  takeCard: PropTypes.func,
  discardCard: PropTypes.func,
  takeTile: PropTypes.func,
  incrementPlayerTurn: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  updateInstructions: PropTypes.func,
  placePeopleInSquare: PropTypes.func,
  incrementStage: PropTypes.func,
  incrementPlayerPopulation: PropTypes.func,
  incrementPlayerCasualties: PropTypes.func,
  incrementPlayerSaved: PropTypes.func,
  placeLavaTileOnSquare: PropTypes.func,
  setRunCounter: PropTypes.func,
  addSnackbar: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  flagsState: types.flagsState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  tileState: types.tileState.defaults,
  toggleFlags: () => {},
  takeCard: () => {},
  discardCard: () => {},
  takeTile: () => {},
  incrementPlayerTurn: () => {},
  updatePlayerHand: () => {},
  updateInstructions: () => {},
  placePeopleInSquare: () => {},
  incrementStage: () => {},
  incrementPlayerPopulation: () => {},
  incrementPlayerCasualties: () => {},
  incrementPlayerSaved: () => {},
  placeLavaTileOnSquare: () => {},
  setRunCounter: () => {},
  addSnackbar: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
