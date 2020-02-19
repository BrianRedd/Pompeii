/** @module Deck */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import { ButtonBase } from "@material-ui/core";

const Deck = props => {
  const { topDiscardSrc, drawCard, deckSizes } = props;

  return (
    <Row>
      <Col xs={6}>
        <div className="text-center" data-test="card-pile-deck">
          {deckSizes.deck > 0 ? (
            <ButtonBase
              focusRipple
              onClick={() => drawCard()}
              data-test="card-deck"
            >
              <img
                className="image-fluid pompeii-card"
                alt="Deck"
                src="/assets/cards/Back.png"
              />
            </ButtonBase>
          ) : (
            <div className="discard-pile-empty" />
          )}
          <div data-test="card-pile-deck-empty">Deck ({deckSizes.deck})</div>
        </div>
      </Col>
      <Col xs={6}>
        <div className="text-center" data-test="card-pile-discard">
          {topDiscardSrc ? (
            <img
              data-test="card-discard"
              className="image-fluid pompeii-card"
              alt="Discard"
              src={`/assets/cards/${topDiscardSrc}.png`}
            />
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
  topDiscardSrc: PropTypes.string,
  drawCard: PropTypes.func
};

Deck.defaultProps = {
  deckSizes: {
    deck: 0,
    discard: 0
  },
  topDiscardSrc: "",
  drawCard: () => {}
};
export default Deck;
