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
        <div className="text-center">
          {deckSizes.deck > 0 ? (
            <ButtonBase focusRipple onClick={() => drawCard()}>
              <img
                className="image-fluid pompeii-card"
                alt="Deck"
                src="/assets/cards/Back.png"
              />
            </ButtonBase>
          ) : (
            <div className="discard-pile-empty" />
          )}
          <div>Deck ({deckSizes.deck})</div>
        </div>
      </Col>
      <Col xs={6}>
        <div className="text-center">
          {topDiscardSrc ? (
            <img
              className="image-fluid pompeii-card"
              alt="Discard"
              src={`/assets/cards/${topDiscardSrc}.png`}
            />
          ) : (
            <div className="discard-pile-empty" />
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
