/** @module Card */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import * as types from "../../types/types";

const mapStateToProps = state => {
  return {
    cardsState: state.cardsState
  };
};

/**
 * @function Card
 * @description Functional helper component for Card
 * @returns {React.Component} - Rendered Card image.
 */
const Card = props => {
  const {
    cardsState: { cards },
    cardId
  } = props;

  const [cardName, setCardName] = useState("");
  const [cardSrc, setCardSrc] = useState("");

  useEffect(() => {
    if (_.get(cards, `${cardId}`)) {
      setCardName(cards[cardId].name);
      setCardSrc(
        `${cards[cardId].type}-${cards[cardId].number}-${cards[cardId].color}`
      );
    }
  }, [cards, cardId]);

  return (
    <img
      data-test="presentation-card"
      className="image-fluid pompeii-card"
      alt={cardName}
      src={`./assets/cards/${cardSrc}.png`}
    />
  );
};

Card.propTypes = {
  cardsState: types.cardsState.types,
  cardId: PropTypes.string
};

Card.defaultProps = {
  cardsState: types.cardsState.defaults,
  cardId: ""
};

export const CardBack = () => {
  return (
    <img
      data-test="presentation-card-back"
      className="image-fluid pompeii-card"
      alt="Deck"
      src="./assets/cards/Back.png"
    />
  );
};

export const CardTest = Card;
export default connect(mapStateToProps, null)(Card);
