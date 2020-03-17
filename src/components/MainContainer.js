/** @module MainContainer */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../redux/Actions";
import * as types from "../types/types";
import * as constant from "../data/constants";
import { gridByColor, voidLavaSquares, escapeSquares } from "../data/gridData";
import * as helper from "./Logic/helperFunctions";

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
    addSnackbar,
    setRelativesCounter
  } = props;

  const numberOfEruptionTurns = 6;

  const [activePlayer, setActivePlayer] = useState();

  useEffect(() => {
    setActivePlayer(_.get(playersState, `players.${playersState.turn}`));
  }, [playersState]);

  const [cardGrid, setCardGrid] = useState([]);

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

  const [recommendationArray, setRecommendationArray] = useState();

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
      const idx = recommendationArray.map(rec => rec.space).indexOf(grid);
      recommendationArray.splice(idx, 1);
      setRecommendationArray(recommendationArray);
      setCardGrid([...cardGrid].filter(val => val !== grid));
      addSnackbar({
        message: `${_.get(
          playersState,
          `details.${activePlayer}.name`
        )} places a relative at ${grid.split("_")[1]} x ${grid.split("_")[0]}`,
        type: "success"
      });
    }

    // if enough relatives have been placed, end relative placement
    if (thisPlacedRelatives.length === flagsState.relativesCounter || !grid) {
      setRelativesCounter(0);
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
    if (flagsState.relativesCounter > 0) {
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
    addSnackbar({
      message: `${_.get(
        playersState,
        `details.${activePlayer}.name`
      )} places a person at ${grid.split("_")[1]} x ${grid.split("_")[0]}`,
      type: "success"
    });

    // if there should be relatives, set relative states
    if (
      messageState.stage === 1 &&
      currentOccupants.length > 0 &&
      flagsState.relativesCounter === 0 &&
      !flagsState.flags.includes("card-wild")
    ) {
      console.log("flagsState.relativesCounter:", flagsState.relativesCounter);
      setRelativesCounter(currentOccupants.length);
      setPlacedRelatives([]);
      const newGridArray = _.uniq([
        ...cardGrid,
        ...gridByColor.White,
        ...gridByColor[
          _.get(gridState, `grid.${grid}.buildingName`, "").split(" ")[0]
        ]
      ]).filter(val => val !== grid);
      setCardGrid(newGridArray);

      // placement evaluation/recommendations:
      const evaluations = [];
      let handCanPlaceHere = [];
      const playerHand = _.get(playersState, `details.${activePlayer}.hand`);
      playerHand.forEach(card => {
        handCanPlaceHere = [
          ...handCanPlaceHere,
          ..._.get(cardsState, `cards.${card}.grid`)
        ];
      });
      newGridArray.forEach(newGrid => {
        // criteria:
        // - if empty colored build matching card in hand (capacity - 1)
        const gridDetail = _.get(gridState, `grid.${newGrid}`);
        const coord = newGrid.split("_");
        let value = 1;
        if (
          _.get(
            gridState,
            `grid.${parseFloat(coord[0]) - 1}_${coord[1]}.ventName`
          ) ||
          _.get(
            gridState,
            `grid.${parseFloat(coord[0]) + 1}_${coord[1]}.ventName`
          ) ||
          _.get(
            gridState,
            `grid.${coord[0]}_${parseFloat(coord[1]) - 1}.ventName`
          ) ||
          _.get(
            gridState,
            `grid.${coord[0]}_${parseFloat(coord[1]) + 1}.ventName`
          )
        ) {
          value -= 0.5; // next to vent, reduce delta; TODO, apply bravery to this
        }
        value += (5 - gridDetail.distanceToExit) * 0.5; // distance to exit; modified by strategy
        const availableSpace =
          gridDetail.buildingCapacity - gridDetail.occupants.length;
        console.log("availableSpace", newGrid, availableSpace);
        if (availableSpace > 0 && gridDetail.buildingName === "White") {
          value += 1 + gridDetail.occupants.length;
          value += _.uniqBy(
            gridDetail.occupants.map(occupant => occupant.player)
          ).length;
        }
        if (
          gridDetail.occupants.length === 0 &&
          handCanPlaceHere.includes(newGrid)
        ) {
          value *= 2;
        }
        if (availableSpace < 1) {
          value = 0;
        }
        console.log(
          newGrid,
          "availableSpace:",
          availableSpace,
          "value:",
          value
        );
        evaluations.push({
          space: newGrid,
          value
        });
      });
      setRecommendationArray(evaluations);

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
   * @function playPompCard
   * @description when player plays pompeii card
   * @param {String} card
   */
  const playPompCard = card => {
    console.log("playPompCard; card:", card);
    let gridHighlights = cardsState.cards[card].grid.filter(val =>
      helper.vacancy(val)
    );

    if (!gridHighlights.length) {
      gridHighlights = _.uniqBy([
        ...gridByColor.White,
        ...gridByColor.Grey,
        ...gridByColor.Purple,
        ...gridByColor.Turquoise,
        ...gridByColor.Brown
      ]).filter(val => helper.vacancy(val));
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
            `details.${playersState.players[nextPlayer]}.name`
          )}: ${constant.LAVA_TILE}`,
          color: _.get(
            playersState,
            `details.${playersState.players[nextPlayer]}.color`
          )
        });
      }
    }, 100);
    incrementStage();
    setRecommendationArray([]);
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
    if (_.get(cardsState, `cards.${takenCard}.type`) === constant.AD79) {
      discardCard(takenCard);
      resolveAd79();
      return;
    }

    // check for Omen
    if (_.get(cardsState, `cards.${takenCard}.type`) === constant.OMEN) {
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
    if (!flagsState.flags.includes("placing-lava-tile")) {
      toggleFlags("placing-lava-tile");
    }

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
      addSnackbar({
        message: "Already ran this person this turn!",
        type: "warning"
      });
      return;
    }

    const pop = _.get(gridState, `grid.${square}.occupants.length`);

    const targetZones = helper.calculateRunZones(square, pop + 1);

    setRunZone(targetZones);
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
    const tilesSurroundedByLava = helper.checkForSurroundedTiles(square);
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
   * @param {String} toSquare
   */
  const runToSquare = toSquare => {
    console.log("runToSquare; toSquare:", toSquare);
    if (toSquare === runFromSquare) {
      setRunZone([]);
      return;
    }
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
        vacancy={helper.vacancy}
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
        recommendationArray={recommendationArray}
        setRecommendationArray={setRecommendationArray}
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
  addSnackbar: PropTypes.func,
  setRelativesCounter: PropTypes.func
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
  addSnackbar: () => {},
  setRelativesCounter: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
