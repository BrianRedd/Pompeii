/** @module TilesContainer */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import * as types from "../../types/types";

import Tiles from "./Tiles";

const mapStateToProps = state => {
  return {
    flagsState: state.flagsState,
    playersState: state.playersState,
    tileState: state.tileState
  };
};

/**
 * @function TilesContainer
 * @description Functional Container component for Tiles
 * @returns {React.Component} - Rendered component.
 */
const TilesContainer = props => {
  const { playersState, tileState, pileEnabled, drawTile, lavaTile } = props;

  return (
    <div data-test="container-tiles" className="deck-container">
      <Tiles
        deckSizes={{
          tiles: _.get(tileState, "pile.length", 0)
        }}
        drawTile={drawTile}
        lavaTile={lavaTile}
        pileEnabled={pileEnabled}
        playerColor={_.get(
          playersState,
          `details.${playersState.players[playersState.turn]}.color`
        )}
      />
    </div>
  );
};

TilesContainer.propTypes = {
  tileState: types.tileState.types,
  playersState: types.playersState.types,
  lavaTile: PropTypes.string,
  pileEnabled: PropTypes.bool,
  drawTile: PropTypes.func
};

TilesContainer.defaultProps = {
  tileState: types.tileState.defaults,
  playersState: types.playersState.defaults,
  lavaTile: null,
  pileEnabled: false,
  drawTile: () => {}
};

export const TilesContainerTest = TilesContainer;
export default connect(mapStateToProps)(TilesContainer);