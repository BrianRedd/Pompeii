/** @module Player */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";

import * as types from "../../types/types";

import Card from "../Helpers/Card";

const HandCards = ({ hand }) => {
  if (hand.length > 0) {
    const handCards = hand.map((card, idx) => {
      const key = `${card}-${idx}`;
      return (
        <ButtonBase key={key} focusRipple onClick={() => console.log(card)}>
          <Card cardId={card} />
        </ButtonBase>
      );
    });
    return handCards;
  }
  return null;
};

HandCards.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.string)
};

HandCards.defaultProps = {
  hand: []
};

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
      <HandCards hand={details.hand} />
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
