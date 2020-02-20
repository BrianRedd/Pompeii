/** @module Player */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";

import * as types from "../../types/types";

import Card, { CardBack } from "../Helpers/Card";

const HandCards = ({ hand, myTurn }) => {
  if (hand.length > 0) {
    const handCards = hand.map((card, idx) => {
      const key = `${card}-${idx}`;
      return (
        <ButtonBase
          key={key}
          focusRipple
          onClick={() => console.log(card)}
          disabled={!myTurn}
        >
          {myTurn ? <Card cardId={card} /> : <CardBack />}
        </ButtonBase>
      );
    });
    return handCards;
  }
  return null;
};

HandCards.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.string),
  myTurn: PropTypes.bool
};

HandCards.defaultProps = {
  hand: [],
  myTurn: false
};

/**
 * @function Player
 * @description Functional Presentational component for Player
 * @returns {React.Component} - Rendered component.
 */
const Player = props => {
  const { details, myTurn } = props;

  return (
    <fieldset data-test="presentation-player" className="mt-3">
      <legend style={{ color: myTurn ? details.color : "#999999" }}>
        {details.name}
      </legend>
      <HandCards hand={details.hand} myTurn={myTurn} />
    </fieldset>
  );
};

Player.propTypes = {
  details: types.player.types,
  myTurn: PropTypes.bool
};

Player.defaultProps = {
  details: types.player.defaults,
  myTurn: false
};

export default Player;
