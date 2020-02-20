/** @module Deck */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import { ButtonBase } from "@material-ui/core";

import Card, { CardBack } from "../Helpers/Card";

/**
 * @function Deck
 * @description Functional Presentational component for Deck
 * @returns {React.Component} - Rendered component.
 */
const Deck = props => {
  const { topDiscard, drawCard, deckSizes } = props;

  return (
    <Row data-test="presentation-deck">
      <Col xs={6}>
        <div data-test="card-pile-deck" className="text-center">
          {deckSizes.deck > 0 ? (
            <ButtonBase
              focusRipple
              onClick={() => drawCard()}
              data-test="card-deck"
            >
              <CardBack />
            </ButtonBase>
          ) : (
            <div
              data-test="card-pile-deck-empty"
              className="discard-pile-empty"
            />
          )}
          <div>Deck ({deckSizes.deck})</div>
        </div>
      </Col>
      <Col xs={6}>
        <div data-test="card-pile-discard" className="text-center">
          {topDiscard ? (
            <Card data-test="card-discard" cardId={topDiscard} />
          ) : (
            <div
              data-test="card-pile-discard-empty"
              className="discard-pile-empty"
            />
          )}
          <div>Discard ({deckSizes.discard})</div>
        </div>
      </Col>
    </Row>
  );
};

Deck.propTypes = {
  deckSizes: PropTypes.shape({
    deck: PropTypes.number,
    discard: PropTypes.number
  }),
  topDiscard: PropTypes.string,
  drawCard: PropTypes.func
};

Deck.defaultProps = {
  deckSizes: {
    deck: 0,
    discard: 0
  },
  topDiscard: "",
  drawCard: () => {}
};
export default Deck;
