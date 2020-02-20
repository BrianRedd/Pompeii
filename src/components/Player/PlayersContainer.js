/** @module PlayersContainer */

import React from "react";
import _ from "lodash";

import * as types from "../../types/types";

import Player from "./Player";

/**
 * @function PlayerCards
 * @description List components for player cards
 * @param {Object} props.playersState
 * @returns {React.Component}
 */
const PlayerCards = ({ playersState }) => {
  const playerCards = playersState.players.map(player => {
    return <Player key={player} details={playersState.details[player]} />;
  });
  return playerCards;
};

/**
 * @function PlayersContainer
 * @description Functional Container component for Players
 * @returns {React.Component} - Rendered component.
 */
const PlayersContainer = props => {
  const { playersState } = props;

  return (
    <div data-test="container-players" className="players-container">
      {!_.isEmpty(playersState.details) && (
        <PlayerCards playersState={playersState} />
      )}
    </div>
  );
};

PlayersContainer.propTypes = {
  playersState: types.playersState.types
};

PlayersContainer.defaultProps = {
  playersState: types.playersState.defaults
};

export default PlayersContainer;
