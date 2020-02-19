/** @module DeckContainer */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import * as types from "../../types/types";

import Deck from "./Deck";

const DeckContainer = props => {
  const { cardsState, drawCard } = props;

  const [lastDrawnCard, setLastDrawnCard] = useState(null);
  const [topDiscardSrc, setTopDiscardSrc] = useState(null);

  useEffect(() => {
    if (_.get(cardsState, "discard.length") > 0) {
      const discardLength = cardsState.discard.length;
      const topDiscard = cardsState.discard[discardLength - 1];
      if (topDiscard !== lastDrawnCard) {
        const { cards } = cardsState;
        setLastDrawnCard(topDiscard);
        setTopDiscardSrc(
          `${cards[topDiscard].type}-${cards[topDiscard].number}-${cards[topDiscard].color}`
        );
      }
    }
  }, [cardsState, lastDrawnCard]);

  return (
    <div data-test="container-deck">
      <Deck
        topDiscardSrc={topDiscardSrc}
        deckSizes={{
          deck: _.get(cardsState, "deck.length", 0),
          discard: _.get(cardsState, "discard.length", 0)
        }}
        drawCard={drawCard}
      />
    </div>
  );
};

DeckContainer.propTypes = {
  cardsState: types.cardsState.types,
  drawCard: PropTypes.func
};

DeckContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  drawCard: () => {}
};

export default DeckContainer;
