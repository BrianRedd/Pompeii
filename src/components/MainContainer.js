/** @module MainContainer */

import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../redux/Actions";
import * as types from "../types/types";
import * as constant from "../data/constants";
import { escapeSquares } from "../data/gridData";
import * as helper from "./Logic/helperFunctions";
import { randAndArrangeRecommendations } from "../utils/utilsCommon";
import { playPompCard } from "./Logic/cardLogic";
import { placePerson } from "./Logic/placePeopleLogic";
import { placeRelatives } from "./Logic/placeRelativesLogic";
import { placeLavaTile } from "./Logic/lavaLogic";
import { runForYourLives } from "./Logic/runnerLogic";

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
    gamePlayState,
    gridState,
    messageState,
    playersState,
    playersState: { activePlayer },
    tileState,
    toggleFlags,
    takeCard,
    discardCard,
    incrementPlayerTurn,
    incrementPlayerSaved,
    updatePlayerHand,
    updateInstructions,
    placePeopleInSquare,
    incrementStage,
    incrementPlayerCasualties,
    setRunCounter,
    addRecommendations,
    addActivePlayer,
    setEruptionCounter,
    setLavaTile,
    setDangerZone,
    setRunZone,
    setRunner
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
    if (toSquare === gridState.runFromSquare) {
      setRunZone([]);
      return;
    }
    let numberOfRuns = toSquare ? flagsState.runCount : 0;

    if (numberOfRuns) {
      const oldSquareOccupants = _.get(
        gridState,
        `grid.${gridState.runFromSquare}.occupants`
      );
      const oldSquareIdx = oldSquareOccupants
        .map(person => person.player)
        .indexOf(activePlayer);
      oldSquareOccupants.splice(oldSquareIdx, 1);
      placePeopleInSquare(gridState.runFromSquare, oldSquareOccupants);

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
          gender: _.get(gridState, "runner.gender"),
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
        gamePlayState={gamePlayState}
        gridState={gridState}
        messageState={messageState}
        playersState={playersState}
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
        resolveNoPlaceToPlace={resolveNoPlaceToPlace}
        dangerZone={gridState.dangerZone}
        placeLavaTile={placeLavaTile}
        runToSquare={runToSquare}
        toggleFlags={toggleFlags}
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
  incrementPlayerTurn: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  updateInstructions: PropTypes.func,
  placePeopleInSquare: PropTypes.func,
  incrementStage: PropTypes.func,
  incrementPlayerCasualties: PropTypes.func,
  incrementPlayerSaved: PropTypes.func,
  setRunCounter: PropTypes.func,
  addRecommendations: PropTypes.func,
  addActivePlayer: PropTypes.func,
  setEruptionCounter: PropTypes.func,
  setLavaTile: PropTypes.func,
  setDangerZone: PropTypes.func,
  setRunZone: PropTypes.func,
  setRunner: PropTypes.func
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
  incrementPlayerTurn: () => {},
  updatePlayerHand: () => {},
  updateInstructions: () => {},
  placePeopleInSquare: () => {},
  incrementStage: () => {},
  incrementPlayerCasualties: () => {},
  incrementPlayerSaved: () => {},
  setRunCounter: () => {},
  addRecommendations: () => {},
  addActivePlayer: () => {},
  setEruptionCounter: () => {},
  setLavaTile: () => {},
  setDangerZone: () => {},
  setRunZone: () => {},
  setRunner: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
