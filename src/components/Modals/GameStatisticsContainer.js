/** @module GameStatisticsContainer */

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
 * @function GameStatisticsContainer
 * @description Functional Container component for Game Over Modal
 * @returns {React.Component} - Rendered component.
 */
const GameStatisticsContainer = props => {
  const {
    flagsState: { flags },
    playersState,
    toggleFlags
  } = props;

  const GameStats = "game-stats";

  /**
   * @function acceptGameOver
   * @description After reading statistics, continue
   */
  const acceptGameOver = () => {
    toggleFlags(GameStats);
  };

  return (
    <div data-test="container-statistics-modal">
      <GameOverModal
        playersState={playersState}
        isOpen={flags.includes(GameStats)}
        acceptGameOver={acceptGameOver}
        statisticsOnly
        toggleFlags={toggleFlags}
      />
    </div>
  );
};

GameStatisticsContainer.propTypes = {
  playersState: types.playersState.types,
  flagsState: types.flagsState.types,
  toggleFlags: PropTypes.func
};

GameStatisticsContainer.defaultProps = {
  playersState: types.playersState.defaults,
  flagsState: types.flagsState.defaults,
  toggleFlags: () => {}
};

export const GameStatisticsContainerTest = GameStatisticsContainer;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameStatisticsContainer);
