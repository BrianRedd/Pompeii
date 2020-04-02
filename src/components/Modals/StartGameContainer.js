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

  const startGame = "game-start";

  let initialValues = {
    numberOfPlayers: 3,
    player1: "Player 1",
    player2: "Player 2",
    player3: "Player 3",
    player4: "Player 4",
    player1AI: false,
    player2AI: false,
    player3AI: false,
    player4AI: false,
    startPlayer: 0,
    wildLava: false,
    prePopulate: false,
    startPhase: 0,
    noEruption: false,
    showStrategyValues: false
  };
  if (localStorage.getItem("pompeii")) {
    initialValues = {
      ...initialValues,
      ...JSON.parse(localStorage.getItem("pompeii"))
    };
  }

  /**
   * @function commitStartGame
   * @description After reading statistics, continue
   */
  const commitStartGame = values => {
    localStorage.setItem("pompeii", JSON.stringify(values));
    const details = {};
    for (let i = 1; i <= parseFloat(values.numberOfPlayers); i += 1) {
      details[`player${i}`] = {
        name: values[`player${i}`],
        hand: [],
        color: playerColors[i - 1],
        casualties: [],
        population: [],
        saved: [],
        ai: values[`player${i}AI`]
      };
    }
    const gameSettings = {
      prePopulate: values.prePopulate,
      startPhase: values.startPhase,
      noEruption: values.noEruption,
      showStrategyValues: values.showStrategyValues,
      wildLava: values.wildLava
    };
    let { startPlayer } = values;
    if (parseFloat(startPlayer) === 0) {
      startPlayer = Math.ceil(
        Math.random() * parseFloat(values.numberOfPlayers)
      );
    }
    gameSetup(details, startPlayer, gameSettings);
    toggleFlags(startGame);
  };

  return (
    <div data-test="container-start-game">
      <StartGameModal
        flags={flags}
        commitStartGame={commitStartGame}
        initialValues={initialValues}
      />
    </div>
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
