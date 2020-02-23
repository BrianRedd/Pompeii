/** @module Main */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";

import * as types from "../types/types";

import BoardContainer from "./Board/BoardContainer";
import DeckContainer from "./Deck/DeckContainer";
import PlayersContainer from "./Player/PlayersContainer";
import Highlighter from "./Board/Highlighter";

/**
 * @function Main
 * @description Functional Presentational component for Main
 * @param {Object} props
 * @returns {React.Component} - Rendered component.
 */
const Main = props => {
  const {
    cardsState,
    messageState,
    playersState,
    deckEnabled,
    drawCard,
    discardCard,
    updatePlayerHand,
    playPompCard,
    cardGrid,
    placePerson
  } = props;

  return (
    <Col data-test="presentation-main" className="main-container">
      <Row>
        <BoardContainer messageState={messageState} />
        <div className="off-board">
          <DeckContainer
            cardsState={cardsState}
            drawCard={drawCard}
            deckEnabled={deckEnabled}
          />
          <PlayersContainer
            playersState={playersState}
            discardCard={discardCard}
            updatePlayerHand={updatePlayerHand}
            playPompCard={playPompCard}
          />
        </div>
      </Row>
      {cardGrid.length > 0 && (
        <Highlighter cardGrid={cardGrid} placePerson={placePerson} />
      )}
    </Col>
  );
};

Main.propTypes = {
  cardsState: types.cardsState.types,
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  deckEnabled: PropTypes.bool,
  drawCard: PropTypes.func,
  discardCard: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  playPompCard: PropTypes.func,
  placePerson: PropTypes.func
};

Main.defaultProps = {
  cardsState: types.cardsState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  cardGrid: [],
  deckEnabled: false,
  drawCard: () => {},
  discardCard: () => {},
  updatePlayerHand: () => {},
  playPompCard: () => {},
  placePerson: () => {}
};

export default Main;
