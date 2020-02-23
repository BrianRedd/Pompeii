/** @module Board */

import React from "react";
import { Alert } from "reactstrap";
import _ from "lodash";

import * as types from "../../types/types";
import { stageData } from "../../data/messageData";

/**
 * @function Board
 * @description Functional Presentational component for Board
 * @returns {React.Component} - Rendered component.
 */
const Board = props => {
  const { messageState } = props;

  return (
    <div data-test="presentation-board">
      <Alert
        color={stageData[messageState.stage].color}
        className={`justify-content-center m-0 p-1 row ${messageState.stage >
          0 && "font-weight-bold"}`}
      >
        {stageData[messageState.stage].text}
      </Alert>
      <Alert color="default" className="justify-content-center m-0 p-1 row">
        <span style={{ color: _.get(messageState, "instruction.color") }}>
          {_.get(messageState, "instruction.text")}
        </span>
      </Alert>
      <img alt="Board" src="/assets/Board-grid.png" />
    </div>
  );
};

Board.propTypes = {
  messageState: types.messageState.types
};

Board.defaultProps = {
  messageState: types.messageState.defaults
};

export default Board;
