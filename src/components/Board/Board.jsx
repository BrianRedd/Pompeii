/** @module Board */

import React from "react";

/**
 * @function Board
 * @description Functional Presentational component for Board
 * @returns {React.Component} - Rendered component.
 */
const Board = () => {
  return (
    <div data-test="presentation-board">
      <img alt="Board" src="/assets/Board-grid.png" />
    </div>
  );
};

export default Board;
