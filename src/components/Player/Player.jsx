/** @module Player */

import React from "react";

import * as types from "../../types/types";

import Card from "../Helpers/Card";

/**
 * @function Player
 * @description Functional Presentational component for Player
 * @returns {React.Component} - Rendered component.
 */
const Player = props => {
  const { details } = props;

  return (
    <fieldset data-test="presentation-player" className="mt-3">
      <legend>{details.name}</legend>
      <Card cardId={details.hand[0]} />
    </fieldset>
  );
};

Player.propTypes = {
  details: types.player.types
};

Player.defaultProps = {
  details: types.player.defaults
};

export default Player;
