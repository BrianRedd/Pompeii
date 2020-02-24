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
  const {
    cardsState,
    drawCard,
    deckEnabled,
    pileEnabled,
    drawTile,
    tileState
  } = props;

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
    <div data-test="container-deck" className="deck-container">
      <Deck
        topDiscard={lastDrawnCard}
        deckSizes={{
          deck: _.get(cardsState, "deck.length", 0),
          discard: _.get(cardsState, "discard.length", 0),
          tiles: _.get(tileState, "pile.length", 0)
        }}
        drawCard={drawCard}
        drawTile={drawTile}
        deckEnabled={deckEnabled}
        pileEnabled={pileEnabled}
      />
    </div>
  );
};

DeckContainer.propTypes = {
  cardsState: types.cardsState.types,
  tileState: types.tileState.types,
  deckEnabled: PropTypes.bool,
  pileEnabled: PropTypes.bool,
  drawCard: PropTypes.func,
  drawTile: PropTypes.func
};

DeckContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  tileState: types.tileState.defaults,
  deckEnabled: false,
  pileEnabled: false,
  drawCard: () => {},
  drawTile: () => {}
};

export default DeckContainer;
