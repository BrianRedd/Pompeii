/** @module DeckContainer */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import * as types from "../../types/types";

import Deck from "./Deck";

/**
 * @function DeckContainer
 * @description Functional Container component for Deck
 * @returns {React.Component} - Rendered component.
 */
const DeckContainer = props => {
  const { cardsState, drawCard, deckEnabled } = props;

  const [lastDrawnCard, setLastDrawnCard] = useState(null);

  useEffect(() => {
    if (_.get(cardsState, "discard.length") > 0) {
      const discardLength = cardsState.discard.length;
      const topDiscard = cardsState.discard[discardLength - 1];
      if (topDiscard !== lastDrawnCard) {
        setLastDrawnCard(topDiscard);
      }
    }
  }, [cardsState, lastDrawnCard]);

  return (
    <div data-test="container-deck">
      <Deck
        topDiscard={lastDrawnCard}
        deckSizes={{
          deck: _.get(cardsState, "deck.length", 0),
          discard: _.get(cardsState, "discard.length", 0)
        }}
        drawCard={drawCard}
        deckEnabled={deckEnabled}
      />
    </div>
  );
};

DeckContainer.propTypes = {
  cardsState: types.cardsState.types,
  deckEnabled: PropTypes.bool,
  drawCard: PropTypes.func
};

DeckContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  deckEnabled: false,
  drawCard: () => {}
};

export default DeckContainer;
