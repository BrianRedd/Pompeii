/** @module MainContainer */

import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../redux/Actions";
import * as types from "../types/types";
import * as constant from "../data/constants";
import { voidLavaSquares, escapeSquares } from "../data/gridData";
import * as helper from "./Logic/helperFunctions";
import { randAndArrangeRecommendations } from "../utils/utilsCommon";
import { playPompCard } from "./Logic/cardLogic";
import { placePerson } from "./Logic/placePeopleLogic";
import { placeRelatives } from "./Logic/placeRelativesLogic";

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
    gamePlayState: { recommendations },
    gridState,
    messageState,
    playersState,
    playersState: { activePlayer },
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
    incrementPlayerCasualties,
    placeLavaTileOnSquare,
    setRunCounter,
    addSnackbar,
    updateDistanceToExit,
    addRecommendations,
    addActivePlayer,
    setEruptionCounter,
    setLavaTile
  } = props;

  /**
   * @function setActivePlayer
   * @description dispatches addActivePlayer action within useCallback
   * @param {String} player
   */
  const setActivePlayer = useCallback(
    player => {
      if (player !== playersState.activePlayer) {
        console.log("playersState:", playersState.activePlayer);
        addActivePlayer(player);
      }
    },
    [playersState, addActivePlayer]
  );

  useEffect(() => {
    setActivePlayer(_.get(playersState, `players.${playersState.turn}`));
  }, [playersState, setActivePlayer]);

  // const [lavaTile, setLavaTileToState] = useState();
  const [dangerZone, setDangerZone] = useState([]);
  const [runZone, setRunZone] = useState([]);
  const [runFromSquare, setRunFromSquare] = useState();
  const [runner, setRunner] = useState();

  /**
   * @function setLavaTileLocal
   * @description dispatches action to set lava tile
   */
  const setLavaTileLocal = tile => {
    console.log("setLavaTileLocal; tile:", tile);
    setLavaTile(tile);
    // setLavaTileToState(tile);
  };

  /**
   * @function setRecommendationArray
   * @description dispatches action to add recommendations to state
   * @param {Array} array
   */
  const setRecommendationArray = useCallback(
    array => {
      console.log("setRecommendationArray:", array);
      addRecommendations(array);
    },
    [addRecommendations]
  );

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
        setActivePlayer(playersState.players[nextPlayer]);
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
   * @param {Boolean} ai - is sacrifice performed by AI?
   */
  const performSacrifice = (personObj, square, ai) => {
    console.log(
      "performSacrifice; personObj:",
      personObj,
      "square:",
      square,
      ai
    );
    if (
      !ai &&
      (!flagsState.flags.includes("card-omen") ||
        personObj.player === activePlayer)
    ) {
      return;
    }

    const currentOccupants = _.get(gridState, `grid.${square}.occupants`, []);

    const idx = currentOccupants
      .map(person => person.player)
      .indexOf(personObj.player);
    currentOccupants.splice(idx, 1);

    placePeopleInSquare(square, currentOccupants);
    incrementPlayerCasualties(personObj.player, 1);
    updateInstructions({
      text: `${_.get(playersState, `details.${activePlayer}.name`)}: ${
        constant.DRAW
      }`,
      color: _.get(playersState, `details.${activePlayer}.color`)
    });
    if (flagsState.flags.includes("card-omen")) {
      toggleFlags("card-omen");
    }
  };

  /**
   * @function resolveOmen
   * @description resolve Omen card when drawn - sacrifice another player's person
   */
  const resolveOmen = () => {
    console.log("resolveOmen");
    const playerDetails = _.get(playersState, `details.${activePlayer}`);
    updateInstructions({
      text: `${playerDetails.name}: ${constant.SACRIFICE}`,
      color: playerDetails.color
    });

    // ai performing sacrifice
    if (playerDetails.ai) {
      setTimeout(() => {
        const playersArray = [];
        Object.keys(_.get(playersState, "details")).forEach(player => {
          playersArray.push({
            ...playersState.details[player],
            player
          });
        });
        const playersScores = playersArray
          .filter(player => player.player !== activePlayer)
          .sort((a, b) =>
            // TODO if chaotic, perhaps a 0-1 to this comparison
            a.population - a.casualties * 0.1 <
            b.population - b.casualties * 0.1
              ? 1
              : -1
          );
        const target = playersScores[0];
        const census = [];
        Object.keys(_.get(gridState, "grid")).forEach(square => {
          _.get(gridState, `grid.${square}.occupants`, []).forEach(occupant => {
            census.push({
              player: occupant.player,
              square,
              personObj: occupant
            });
          });
        });
        const targetList = census.filter(person => {
          return person.player === target.player;
        });
        if (targetList.length > 0) {
          const rand = Math.floor(Math.random() * targetList.length);
          performSacrifice(
            targetList[rand].personObj,
            targetList[rand].square,
            true
          );
        }
      }, 1000);
    } else if (!flagsState.flags.includes("card-omen")) {
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
    setLavaTileLocal(tile);

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

    const playerDetails = _.get(playersState, `details.${activePlayer}`);
    if (!hotZones.length) {
      if (playerDetails.ai) {
        setRecommendationArray([{ square: homeVent, value: 1 }]);
      }
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
        if (playerDetails.ai) {
          // recommendations
          const evaluations = [];
          filteredZones.forEach(zone => {
            let value = 1 + _.get(gridState, `grid.${zone}.occupants.length`);
            if (
              _.get(gridState, `grid.${zone}.occupants`)
                .map(occupant => occupant.player)
                .includes(activePlayer)
            ) {
              value = -2;
            }

            evaluations.push({
              square: zone,
              value
            });
          });
          setRecommendationArray(randAndArrangeRecommendations(evaluations));
        }

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
    const playerDetails = _.get(playersState, `details.${activePlayer}`);
    await updateInstructions({
      text: `${playerDetails.name}: ${constant.RUN}`,
      color: playerDetails.color
    });
    if (playerDetails.ai) {
      setRecommendationArray(
        randAndArrangeRecommendations(helper.runnerRecommendations())
      );
    }
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
    setLavaTileLocal();
    setDangerZone([]);
    if (flagsState.eruptionCount) {
      setEruptionCounter(flagsState.eruptionCount - 1);
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
    setLavaTileLocal(takenTile);
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
    const playerDetails = _.get(playersState, `details.${activePlayer}`);
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
      playerDetails.population !== 1
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
    if (playerDetails.ai) {
      setRecommendationArray(
        randAndArrangeRecommendations(
          helper.runToRecommendations(targetZones, square)
        )
      );
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
   * @function placeLavaTile
   * @description placing tile in highlight area
   * @param {String} square
   */
  const placeLavaTile = square => {
    console.log("placeLavaTile:", tileState.lavaTile, square);
    placeLavaTileOnSquare(square, tileState.lavaTile);

    _.get(gridState, `grid.${square}.occupants`, []).forEach(person => {
      incrementPlayerCasualties(person.player, 1);
    });
    placePeopleInSquare(square, []);

    if (flagsState.flags.includes("placing-lava-tile")) {
      toggleFlags("placing-lava-tile");
    }
    setLavaTileLocal();
    setDangerZone([]);
    setRecommendationArray([]);

    // check for tiles surrounded by lava
    const tilesSurroundedByLava = helper.checkForSurroundedTiles(
      square,
      updateDistanceToExit
    );
    if (tilesSurroundedByLava.length > 0) {
      burnSurroundedTiles(tilesSurroundedByLava);
    }

    // TODO update distance to exit

    if (flagsState.eruptionCount) {
      setEruptionCounter(flagsState.eruptionCount - 1);
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
    setRecommendationArray([]);
    const playerDetails = _.get(playersState, `details.${activePlayer}`);
    console.log("runToSquare; toSquare:", toSquare);
    if (toSquare === runFromSquare) {
      setRunZone([]);
      return;
    }
    let numberOfRuns = toSquare ? flagsState.runCount : 0;

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
        if (playerDetails.population === 1) {
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
    if (playerDetails.population < 1) {
      numberOfRuns = 0;
    }
    setRunCounter(numberOfRuns);
    setRunZone([]);
    setRunner();
    if (!numberOfRuns) {
      incrementPlayerTurn();
    } else if (playerDetails.ai) {
      setRecommendationArray(
        randAndArrangeRecommendations(helper.runnerRecommendations())
      );
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
          !flagsState.runCount
        }
        playPompCard={playPompCard}
        placePerson={placePerson}
        placeRelatives={placeRelatives}
        cardGrid={cardsState.grid}
        vacancy={helper.vacancy}
        performSacrifice={performSacrifice}
        drawTile={drawTile}
        resolveNoPlaceToPlace={resolveNoPlaceToPlace}
        // lavaTile={tileState.lavaTile}
        highlightDangerZones={highlightDangerZones}
        dangerZone={dangerZone}
        placeLavaTile={placeLavaTile}
        selectRunner={selectRunner}
        runZone={runZone}
        runToSquare={runToSquare}
        toggleFlags={toggleFlags}
        activePlayer={activePlayer}
        recommendations={recommendations}
      />
    </div>
  );
};

MainContainer.propTypes = {
  cardsState: types.cardsState.types,
  flagsState: types.flagsState.types,
  gamePlayState: types.gamePlayState.types,
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
  incrementPlayerCasualties: PropTypes.func,
  incrementPlayerSaved: PropTypes.func,
  placeLavaTileOnSquare: PropTypes.func,
  setRunCounter: PropTypes.func,
  addSnackbar: PropTypes.func,
  updateDistanceToExit: PropTypes.func,
  addRecommendations: PropTypes.func,
  addActivePlayer: PropTypes.func,
  setEruptionCounter: PropTypes.func,
  setLavaTile: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  flagsState: types.flagsState.defaults,
  gamePlayState: types.gamePlayState.defaults,
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
  incrementPlayerCasualties: () => {},
  incrementPlayerSaved: () => {},
  placeLavaTileOnSquare: () => {},
  setRunCounter: () => {},
  addSnackbar: () => {},
  updateDistanceToExit: () => {},
  addRecommendations: () => {},
  addActivePlayer: () => {},
  setEruptionCounter: () => {},
  setLavaTile: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
