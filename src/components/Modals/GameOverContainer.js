/** @module GameOverContainer */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import actions from "../../redux/Actions";
import * as types from "../../types/types";

import GameOverModal from "./GameOverModal";

const mapStateToProps = state => {
  return {
    flagsState: state.flagsState,
    playersState: state.playersState
  };
};

const mapDispatchToProps = {
  toggleFlags: actions.toggleFlags
};

/**
 * @function GameOverContainer
 * @description Functional Container component for Game Over Modal
 * @returns {React.Component} - Rendered component.
 */
const GameOverContainer = props => {
  const {
    flagsState: { flags },
    playersState,
    toggleFlags
  } = props;

  const GameOver = "game-over";

  /**
   * @function acceptGameOver
   * @description After reading statistics, continue
   */
  const acceptGameOver = () => {
    toggleFlags(GameOver);
    toggleFlags("game-start");
  };

  return (
    <GameOverModal
      playersState={playersState}
      flags={flags}
      acceptGameOver={acceptGameOver}
    />
  );
};

GameOverContainer.propTypes = {
  playersState: types.playersState.types,
  flagsState: types.flagsState.types,
  toggleFlags: PropTypes.func
};

GameOverContainer.defaultProps = {
  playersState: types.playersState.defaults,
  flagsState: types.flagsState.defaults,
  toggleFlags: () => {}
};

export const GameOverContainerTest = GameOverContainer;
export default connect(mapStateToProps, mapDispatchToProps)(GameOverContainer);
