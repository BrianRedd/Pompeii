/** @module Main */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";

import * as types from "../types/types";

import BoardContainer from "./Board/BoardContainer";
import DeckContainer from "./Deck/DeckContainer";
import PlayersContainer from "./Player/PlayersContainer";

/**
 * @function Main
 * @description Functional Presentational component for Main
 * @returns {React.Component} - Rendered component.
 */
const Main = props => {
  const { cardsState, playersState, drawCard } = props;

  return (
    <Col data-test="presentation-main" className="main-container">
      <Row>
        <BoardContainer />
        <div className="off-board">
          <DeckContainer cardsState={cardsState} drawCard={drawCard} />
          <PlayersContainer playersState={playersState} />
        </div>
      </Row>
    </Col>
  );
};

Main.propTypes = {
  cardsState: types.cardsState.types,
  playersState: types.playersState.types,
  drawCard: PropTypes.func
};

Main.defaultProps = {
  cardsState: types.cardsState.defaults,
  playersState: types.playersState.defaults,
  drawCard: () => {}
};

export default Main;
