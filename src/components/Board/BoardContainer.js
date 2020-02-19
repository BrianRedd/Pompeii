/** @module BoardContainer */

import React from "react";

import Board from "./Board";

/**
 * @function BoardContainer
 * @description Functional Container component for Board
 * @returns {React.Component} - Rendered component.
 */
const BoardContainer = () => {
  return (
    <div data-test="container-board" className="board-container">
      <Board />
    </div>
  );
};

export default BoardContainer;
