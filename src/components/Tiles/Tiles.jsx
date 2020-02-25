/** @module Tiles */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import { ButtonBase } from "@material-ui/core";

/**
 * @function Tiles
 * @description Functional Presentational component for Tiles
 * @returns {React.Component} - Rendered component.
 */
const Tiles = props => {
  const { deckSizes, pileEnabled, drawTile } = props;

  return (
    <Row data-test="presentation-tiles">
      <Col xs={12}>
        <div data-test="tile-pile-deck" className="text-center tile-pile">
          <ButtonBase
            data-test="tile-pile"
            focusRipple
            disabled={!pileEnabled}
            onClick={() => drawTile()}
          >
            <img alt="Tiles" src="/assets/tiles/back.png" />
          </ButtonBase>
        </div>
        <div className="text-center">Lava Tiles ({deckSizes.tiles})</div>
      </Col>
    </Row>
  );
};

Tiles.propTypes = {
  deckSizes: PropTypes.shape({
    deck: PropTypes.number,
    discard: PropTypes.number,
    tiles: PropTypes.number
  }),
  pileEnabled: PropTypes.bool,
  drawTile: PropTypes.func
};

Tiles.defaultProps = {
  deckSizes: {
    deck: 0,
    discard: 0,
    tiles: 0
  },
  pileEnabled: false,
  drawTile: () => {}
};
export default Tiles;
