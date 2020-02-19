/** @module BoardContainer */

import React from "react";

import Board from "./Board";

const BoardContainer = () => {
  return (
    <div data-test="container-board" className="board-container">
      <Board />
    </div>
  );
};

export default BoardContainer;
