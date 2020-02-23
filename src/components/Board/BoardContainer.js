/** @module BoardContainer */

import React from "react";
import PropTypes from "prop-types";

import * as types from "../../types/types";

import Board from "./Board";
import OccupancyLayer from "./OccupancyLayer";

/**
 * @function BoardContainer
 * @description Functional Container component for Board
 * @returns {React.Component} - Rendered component.
 */
const BoardContainer = props => {
  const { messageState, gridState, playersState, performSacrifice } = props;
  return (
    <div data-test="container-board" className="board-container">
      <Board messageState={messageState} />
      <OccupancyLayer
        gridState={gridState}
        playersState={playersState}
        performSacrifice={performSacrifice}
      />
    </div>
  );
};

BoardContainer.propTypes = {
  gridState: types.gridState.types,
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  performSacrifice: PropTypes.func
};

BoardContainer.defaultProps = {
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  performSacrifice: () => {}
};

export default BoardContainer;
