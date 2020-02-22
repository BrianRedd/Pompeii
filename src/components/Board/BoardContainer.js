/** @module BoardContainer */

import React from "react";

import * as types from "../../types/types";

import Board from "./Board";

/**
 * @function BoardContainer
 * @description Functional Container component for Board
 * @returns {React.Component} - Rendered component.
 */
const BoardContainer = props => {
  const { messageState } = props;
  return (
    <div data-test="container-board" className="board-container">
      <Board messageState={messageState} />
    </div>
  );
};

BoardContainer.propTypes = {
  messageState: types.messageState.types
};

BoardContainer.defaultProps = {
  messageState: types.messageState.defaults
};

export default BoardContainer;
