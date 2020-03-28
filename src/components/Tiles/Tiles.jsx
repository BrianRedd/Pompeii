/** @module Tiles */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Progress } from "reactstrap";
import { ButtonBase } from "@material-ui/core";

/**
 * @function Tiles
 * @description Functional Presentational component for Tiles
 * @returns {React.Component} - Rendered component.
 */
const Tiles = props => {
  const {
    deckSizes,
    pileEnabled,
    drawTile,
    lavaTile,
    playerColor,
    eruptionCount
  } = props;

  return (
    <Row data-test="presentation-tiles">
      <Col xs={12}>
        <div data-test="tile-pile-deck" className="text-center tile-pile">
          {eruptionCount > 0 && (
            <Progress
              className="eruption-progress"
              striped
              color="danger"
              value={(eruptionCount / 6) * 100}
            />
          )}
          <ButtonBase
            data-test="tile-pile"
            focusRipple
            disabled={!pileEnabled}
            onClick={() => drawTile()}
            style={pileEnabled ? { borderColor: `rgb(${playerColor})` } : {}}
          >
            {lavaTile ? (
              <img alt={lavaTile} src={`/assets/tiles/${lavaTile}.png`} />
            ) : (
              <img alt="Tile Pile" src="/assets/tiles/back.png" />
            )}
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
  playerColor: PropTypes.string,
  lavaTile: PropTypes.string,
  eruptionCount: PropTypes.number,
  pileEnabled: PropTypes.bool,
  drawTile: PropTypes.func
};

Tiles.defaultProps = {
  deckSizes: {
    deck: 0,
    discard: 0,
    tiles: 0
  },
  playerColor: "",
  lavaTile: null,
  eruptionCount: 0,
  pileEnabled: false,
  drawTile: () => {}
};
export default Tiles;
