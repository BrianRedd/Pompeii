/** @module Main */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";

import * as types from "../types/types";

import BoardContainer from "./Board/BoardContainer";
import DeckContainer from "./Deck/DeckContainer";
import TilesContainer from "./Tiles/TilesContainer";
import PlayersContainer from "./Player/PlayersContainer";
import PlacementHighlighter from "./Board/PlacementHighlighter";
import AD79Sidebar from "./Sidebars/AD79Sidebar";
import LavaTileSidebar from "./Sidebars/LavaTileSidebar";

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
    tileState,
    deckEnabled,
    drawCard,
    discardCard,
    updatePlayerHand,
    playPompCard,
    cardGrid,
    placePerson,
    vacancy,
    performSacrifice,
    flags,
    pileEnabled,
    drawTile,
    lavaTile,
    highlightDangerZones,
    dangerZone,
    placeLavaTile
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
          {flags.ad79Flag && <AD79Sidebar setAD79Flag={flags.setAD79Flag} />}
          {flags.lavaFlag && (
            <LavaTileSidebar
              lavaTile={lavaTile}
              tileState={tileState}
              highlightDangerZones={highlightDangerZones}
            />
          )}
          {messageState.stage < 2 && !flags.ad79Flag && !flags.lavaFlag && (
            <DeckContainer
              cardsState={cardsState}
              playersState={playersState}
              drawCard={drawCard}
              deckEnabled={deckEnabled}
            />
          )}
          {messageState.stage === 2 && !flags.ad79Flag && !flags.lavaFlag && (
            <TilesContainer
              tileState={tileState}
              drawTile={drawTile}
              pileEnabled={pileEnabled}
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
      {messageState.stage < 2 ? (
        <PlacementHighlighter
          gridArray={cardGrid}
          selectSquare={placePerson}
          validation={vacancy}
        />
      ) : (
        <PlacementHighlighter
          gridArray={dangerZone}
          selectSquare={val => {
            placeLavaTile(val);
          }}
          validation={() => {
            return true;
          }}
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
  tileState: types.tileState.types,
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  dangerZone: PropTypes.arrayOf(PropTypes.string),
  flags: PropTypes.shape({
    ad79Flag: PropTypes.bool,
    setAD79Flag: PropTypes.func,
    lavaFlag: PropTypes.bool,
    setLavaFlag: PropTypes.func
  }),
  lavaTile: PropTypes.string,
  deckEnabled: PropTypes.bool,
  pileEnabled: PropTypes.bool,
  drawCard: PropTypes.func,
  discardCard: PropTypes.func,
  drawTile: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  playPompCard: PropTypes.func,
  placePerson: PropTypes.func,
  vacancy: PropTypes.func,
  performSacrifice: PropTypes.func,
  highlightDangerZones: PropTypes.func,
  placeLavaTile: PropTypes.func
};

Main.defaultProps = {
  cardsState: types.cardsState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  tileState: types.tileState.defaults,
  cardGrid: [],
  dangerZone: [],
  flags: {
    ad79Flag: false,
    setAD79Flag: () => {},
    lavaFlag: false,
    setLavaFlag: () => {}
  },
  lavaTile: "",
  deckEnabled: false,
  pileEnabled: false,
  drawCard: () => {},
  discardCard: () => {},
  drawTile: () => {},
  updatePlayerHand: () => {},
  playPompCard: () => {},
  placePerson: () => {},
  vacancy: () => {},
  performSacrifice: () => {},
  highlightDangerZones: () => {},
  placeLavaTile: () => {}
};

export default Main;
