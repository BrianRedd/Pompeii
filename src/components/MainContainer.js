/** @module MainContainer */

import React, { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../redux/Actions";
import * as types from "../types/types";
import * as helper from "./Logic/helperFunctions";
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
    incrementPlayerTurn,
    setRunCounter,
    addActivePlayer,
    setEruptionCounter,
    setLavaTile,
    setDangerZone
  } = props;

  /**
   * @function setActivePlayer
   * @description dispatches addActivePlayer action within useCallback
   * @param {String} player
   */
  const setActivePlayer = useCallback(
    player => {
      if (player !== playersState.activePlayer) {
        addActivePlayer(player);
      }
    },
    [playersState, addActivePlayer]
  );

  useEffect(() => {
    setActivePlayer(_.get(playersState, `players.${playersState.turn}`));
  }, [playersState, setActivePlayer]);

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
      console.log(
        `%c***If ${activePlayer} is AI, should they auto-draw now?`,
        "color: red; font-weight: bold"
      );
      incrementPlayerTurn();
    } else if (
      _.get(playersState, `details.${activePlayer}.population.length`) < 1
    ) {
      console.log(
        `%c***If ${activePlayer} is AI, should they auto-draw now?`,
        "color: red; font-weight: bold"
      );
      incrementPlayerTurn();
    } else {
      console.log(
        `%c***If ${activePlayer} is AI, should they auto-draw now?`,
        "color: red; font-weight: bold"
      );
      setRunCounter(2);
      runForYourLives();
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
        deckEnabled={
          _.get(playersState, `details.${activePlayer}.hand.length`) < 4 &&
          !flagsState.flags.includes("placing-person") &&
          !flagsState.flags.includes("card-omen") &&
          (!_.get(playersState, `details.${playersState.activePlayer}.ai`) ||
            _.get(gamePlayState, "gameSettings.autoPlayDisabled"))
        }
        pileEnabled={
          messageState.stage === 2 &&
          !flagsState.flags.includes("placing-lava-tile") &&
          !flagsState.runCount &&
          (!_.get(playersState, `details.${playersState.activePlayer}.ai`) ||
            _.get(gamePlayState, "gameSettings.autoPlayDisabled"))
        }
        playPompCard={playPompCard}
        placePerson={placePerson}
        placeRelatives={placeRelatives}
        cardGrid={cardsState.grid}
        vacancy={helper.vacancy}
        resolveNoPlaceToPlace={resolveNoPlaceToPlace}
        dangerZone={gridState.dangerZone}
        placeLavaTile={placeLavaTile}
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
  incrementPlayerTurn: PropTypes.func,
  setRunCounter: PropTypes.func,
  addActivePlayer: PropTypes.func,
  setEruptionCounter: PropTypes.func,
  setLavaTile: PropTypes.func,
  setDangerZone: PropTypes.func
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
  incrementPlayerTurn: () => {},
  setRunCounter: () => {},
  addActivePlayer: () => {},
  setEruptionCounter: () => {},
  setLavaTile: () => {},
  setDangerZone: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
