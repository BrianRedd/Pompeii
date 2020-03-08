/** @module StartGameContainer */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import actions from "../../redux/Actions";
import * as types from "../../types/types";
import { playerColors } from "../../data/playerData";

import StartGameModal from "./StartGameModal";

const mapStateToProps = state => {
  return {
    flagsState: state.flagsState
  };
};

const mapDispatchToProps = {
  toggleFlags: actions.toggleFlags,
  gameSetup: actions.gameSetup
};

/**
 * @function StartGameContainer
 * @description Functional Container component for Game Over Modal
 * @returns {React.Component} - Rendered component.
 */
const StartGameContainer = props => {
  const {
    flagsState: { flags },
    toggleFlags,
    gameSetup
  } = props;

  const StartGame = "game-start";

  let initialValues = {
    numberOfPlayers: 3,
    player1: "Player 1",
    player2: "Player 2",
    player3: "Player 3",
    player4: "Player 4",
    prePopulate: false,
    startPhase: 0
  };
  if (localStorage.getItem("pompeii")) {
    initialValues = JSON.parse(localStorage.getItem("pompeii"));
  }

  /**
   * @function commitStartGame
   * @description After reading statistics, continue
   */
  const commitStartGame = values => {
    localStorage.setItem("pompeii", JSON.stringify(values));
    const details = {};
    for (let i = 1; i <= values.numberOfPlayers; i += 1) {
      details[`player${i}`] = {
        name: values[`player${i}`],
        hand: [],
        color: playerColors[i - 1],
        casualties: 0,
        population: 0,
        saved: 0
      };
    }
    let testMode = {};
    if (values.prePopulate || values.startPhase) {
      testMode = {
        active: values.prePopulate,
        stage: values.startPhase
      };
    }
    gameSetup(details, testMode);
    toggleFlags(StartGame);
  };

  return (
    <StartGameModal
      flags={flags}
      commitStartGame={commitStartGame}
      initialValues={initialValues}
    />
  );
};

StartGameContainer.propTypes = {
  flagsState: types.flagsState.types,
  toggleFlags: PropTypes.func,
  gameSetup: PropTypes.func
};

StartGameContainer.defaultProps = {
  flagsState: types.flagsState.defaults,
  toggleFlags: () => {},
  gameSetup: () => {}
};

export const StartGameContainerTest = StartGameContainer;
export default connect(mapStateToProps, mapDispatchToProps)(StartGameContainer);
