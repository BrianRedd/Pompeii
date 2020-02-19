/** @module Main */

import React from "react";

import * as types from "../types/types";

import BoardContainer from "./Board/BoardContainer";

const Main = props => {
  const { cardsState, playersState } = props;

  return (
    <div data-test="presentation-main">
      <BoardContainer cardsState={cardsState} playersState={playersState} />
    </div>
  );
};

Main.propTypes = {
  cardsState: types.cardsState.types,
  playersState: types.playersState.types
};

Main.defaultProps = {
  cardsState: types.cardsState.defaults,
  playersState: types.playersState.defaults
};

export default Main;
