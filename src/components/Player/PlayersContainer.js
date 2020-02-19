/** @module PlayersContainer */

import React from "react";

import * as types from "../../types/types";

import Player from "./Player";

/**
 * @function PlayersContainer
 * @description Functional Container component for Players
 * @returns {React.Component} - Rendered component.
 */
const PlayersContainer = props => {
  const { playersState } = props;

  return (
    <div data-test="container-players">
      <Player details={playersState.details.player1} />
      <Player details={playersState.details.player2} />
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
