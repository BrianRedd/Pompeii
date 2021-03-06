/** @module GameOverContainer */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";

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
    playersState
  } = props;

  const [rankings, setRankings] = useState();

  useEffect(() => {
    const statistics = _.get(playersState, "players").map(player => {
      return {
        code: player,
        name: _.get(playersState, `details.${player}.name`),
        victoryPoints:
          parseFloat(_.get(playersState, `details.${player}.saved.length`, 0)) *
            100 +
          99 -
          parseFloat(
            _.get(playersState, `details.${player}.casualties.length`, 0)
          )
      };
    });
    setRankings(
      statistics.sort((a, b) => (b.victoryPoints > a.victoryPoints ? 1 : -1))
    );
  }, [playersState]);

  const gameOver = "game-over";

  /**
   * @function acceptGameOver
   * @description After reading statistics, continue
   */
  const acceptGameOver = () => {
    document.location.reload();
  };

  return (
    <div data-test="container-game-over-modal">
      {rankings && (
        <GameOverModal
          playersState={playersState}
          isOpen={flags.includes(gameOver)}
          acceptGameOver={acceptGameOver}
          rankings={rankings}
        />
      )}
    </div>
  );
};

GameOverContainer.propTypes = {
  playersState: types.playersState.types,
  flagsState: types.flagsState.types
};

GameOverContainer.defaultProps = {
  playersState: types.playersState.defaults,
  flagsState: types.flagsState.defaults
};

export const GameOverContainerTest = GameOverContainer;
export default connect(mapStateToProps, mapDispatchToProps)(GameOverContainer);
