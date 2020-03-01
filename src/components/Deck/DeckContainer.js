/** @module DeckContainer */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import * as types from "../../types/types";

import Deck from "./Deck";

const mapStateToProps = state => {
  return {
    cardsState: state.cardsState,
    flagsState: state.flagsState,
    playersState: state.playersState
  };
};

/**
 * @function DeckContainer
 * @description Functional Container component for Deck
 * @returns {React.Component} - Rendered component.
 */
const DeckContainer = props => {
  const { cardsState, playersState, drawCard, deckEnabled } = props;

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
          discard: _.get(cardsState, "discard.length", 0)
        }}
        drawCard={drawCard}
        deckEnabled={deckEnabled}
        playerColor={_.get(
          playersState,
          `details.${playersState.players[playersState.turn]}.color`
        )}
      />
    </div>
  );
};

DeckContainer.propTypes = {
  cardsState: types.cardsState.types,
  playersState: types.playersState.types,
  deckEnabled: PropTypes.bool,
  drawCard: PropTypes.func
};

DeckContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  playersState: types.playersState.defaults,
  deckEnabled: false,
  drawCard: () => {}
};

export const DeckContainerTest = DeckContainer;
export default connect(mapStateToProps)(DeckContainer);
