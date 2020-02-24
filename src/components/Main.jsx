/** @module Main */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import _ from "lodash";

import * as types from "../types/types";

import BoardContainer from "./Board/BoardContainer";
import DeckContainer from "./Deck/DeckContainer";
import PlayersContainer from "./Player/PlayersContainer";
import PlacementHighlighter from "./Board/PlacementHighlighter";
import AD79Sidebar from "./Helpers/AD79Sidebar";
import OmenSidebar from "./Helpers/OmenSidebar";

/**
 * @function Main
 * @description Functional Presentational component for Main
 * @param {Object} props
 * @returns {React.Component} - Rendered component.
 */
const Main = props => {
  const {
    cardsState,
    gridState,
    messageState,
    playersState,
    deckEnabled,
    drawCard,
    discardCard,
    updatePlayerHand,
    playPompCard,
    cardGrid,
    placePerson,
    vacancy,
    performSacrifice,
    omenFlag,
    setOmenFlag,
    ad79Flag,
    setAD79Flag,
    sacrificeMessage,
    setSacrificeMessage
  } = props;

  return (
    <Col data-test="presentation-main" className="main-container">
      <Row>
        <BoardContainer
          messageState={messageState}
          gridState={gridState}
          playersState={playersState}
          performSacrifice={performSacrifice}
        />
        <div className="off-board">
          {omenFlag && (
            <OmenSidebar
              name={_.get(
                playersState,
                `details.${playersState.players[playersState.turn]}.name`
              )}
              setOmenFlag={setOmenFlag}
              sacrificeMessage={sacrificeMessage}
              setSacrificeMessage={setSacrificeMessage}
            />
          )}
          {ad79Flag && <AD79Sidebar setAD79Flag={setAD79Flag} />}
          {!omenFlag && !ad79Flag && (
            <DeckContainer
              cardsState={cardsState}
              drawCard={drawCard}
              deckEnabled={deckEnabled}
            />
          )}
          <PlayersContainer
            playersState={playersState}
            discardCard={discardCard}
            updatePlayerHand={updatePlayerHand}
            playPompCard={playPompCard}
            stage={messageState.stage}
          />
        </div>
      </Row>
      {cardGrid.length > 0 && (
        <PlacementHighlighter
          gridArray={cardGrid}
          selectSquare={placePerson}
          validation={vacancy}
        />
      )}
    </Col>
  );
};

Main.propTypes = {
  cardsState: types.cardsState.types,
  gridState: types.gridState.types,
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  sacrificeMessage: PropTypes.string,
  deckEnabled: PropTypes.bool,
  omenFlag: PropTypes.bool,
  ad79Flag: PropTypes.bool,
  drawCard: PropTypes.func,
  discardCard: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  playPompCard: PropTypes.func,
  placePerson: PropTypes.func,
  vacancy: PropTypes.func,
  performSacrifice: PropTypes.func,
  setOmenFlag: PropTypes.func,
  setAD79Flag: PropTypes.func,
  setSacrificeMessage: PropTypes.func
};

Main.defaultProps = {
  cardsState: types.cardsState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  cardGrid: [],
  sacrificeMessage: "",
  deckEnabled: false,
  omenFlag: false,
  ad79Flag: false,
  drawCard: () => {},
  discardCard: () => {},
  updatePlayerHand: () => {},
  playPompCard: () => {},
  placePerson: () => {},
  vacancy: () => {},
  performSacrifice: () => {},
  setOmenFlag: () => {},
  setAD79Flag: () => {},
  setSacrificeMessage: () => {}
};

export default Main;
