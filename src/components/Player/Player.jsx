/** @module Player */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";

import * as types from "../../types/types";

import Card, { CardBack } from "../Helpers/Card";

const HandCards = ({ hand, myTurn, playCard }) => {
  if (hand.length > 0) {
    const handCards = hand.map((card, idx) => {
      const key = `${card}-${idx}`;
      return (
        <ButtonBase
          key={key}
          focusRipple
          onClick={() => playCard(idx)}
          disabled={
            !myTurn ||
            hand.length < 4 ||
            (hand.includes("AD79") && card !== "AD79") ||
            (hand.includes("OMEN") && card !== "OMEN")
          }
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
  myTurn: PropTypes.bool,
  playCard: PropTypes.func
};

HandCards.defaultProps = {
  hand: [],
  myTurn: false,
  playCard: () => {}
};

/**
 * @function Player
 * @description Functional Presentational component for Player
 * @returns {React.Component} - Rendered component.
 */
const Player = props => {
  const { details, myTurn, playCard } = props;

  return (
    <fieldset
      data-test="presentation-player"
      className="mt-3"
      style={{
        backgroundColor: myTurn ? `rgba(${details.color}, 0.3)` : "transparent"
      }}
    >
      <legend
        style={{ color: `rgb(${details.color})` }}
        className="d-flex w-100 justify-content-between"
      >
        <span className="font-weight-bold">{details.name}</span>
        <span>Population: {details.population}</span>
        <span>Casualites: {details.casualties}</span>
      </legend>
      <HandCards hand={details.hand} myTurn={myTurn} playCard={playCard} />
    </fieldset>
  );
};

Player.propTypes = {
  details: types.playerDetails.types,
  myTurn: PropTypes.bool,
  playCard: PropTypes.func
};

Player.defaultProps = {
  details: types.playerDetails.defaults,
  myTurn: false,
  playCard: () => {}
};

export default Player;
