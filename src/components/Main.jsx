/** @module Main */

import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import _ from "lodash";

import * as types from "../types/types";

import BoardContainer from "./Board/BoardContainer";
import DeckContainer from "./Deck/DeckContainer";
import TilesContainer from "./Tiles/TilesContainer";
import PlayersContainer from "./Player/PlayersContainer";
import PlacementHighlighter from "./Board/PlacementHighlighter";
import AD79Sidebar from "./Sidebars/AD79Sidebar";
import OmenSidebar from "./Sidebars/OmenSidebar";
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
    sacrificeMessage,
    setSacrificeMessage,
    pileEnabled,
    drawTile,
    lavaTile,
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
          {flags.omenFlag && (
            <OmenSidebar
              name={_.get(
                playersState,
                `details.${playersState.players[playersState.turn]}.name`
              )}
              setOmenFlag={flags.setOmenFlag}
              sacrificeMessage={sacrificeMessage}
              setSacrificeMessage={setSacrificeMessage}
            />
          )}
          {flags.ad79Flag && <AD79Sidebar setAD79Flag={flags.setAD79Flag} />}
          {flags.lavaFlag && (
            <LavaTileSidebar
              lavaTile={lavaTile}
              tileState={tileState}
              placeLavaTile={placeLavaTile}
            />
          )}
          {messageState.stage < 2 &&
            !flags.omenFlag &&
            !flags.ad79Flag &&
            !flags.lavaFlag && (
              <DeckContainer
                cardsState={cardsState}
                tileState={tileState}
                drawCard={drawCard}
                drawTile={drawTile}
                deckEnabled={deckEnabled}
                pileEnabled={pileEnabled}
              />
            )}
          {messageState.stage === 2 &&
            !flags.omenFlag &&
            !flags.ad79Flag &&
            !flags.lavaFlag && (
              <TilesContainer
                cardsState={cardsState}
                tileState={tileState}
                drawCard={drawCard}
                drawTile={drawTile}
                deckEnabled={deckEnabled}
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
          gridArray={["0_7"]}
          selectSquare={val => {
            console.log("Lava placed", val);
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
  flags: PropTypes.shape({
    omenFlag: PropTypes.bool,
    setOmenFlag: PropTypes.func,
    ad79Flag: PropTypes.bool,
    setAD79Flag: PropTypes.func,
    lavaFlag: PropTypes.bool,
    setLavaFlag: PropTypes.func
  }),
  sacrificeMessage: PropTypes.string,
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
  setSacrificeMessage: PropTypes.func,
  placeLavaTile: PropTypes.func
};

Main.defaultProps = {
  cardsState: types.cardsState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  tileState: types.tileState.defaults,
  cardGrid: [],
  flags: {
    omenFlag: false,
    setOmenFlag: () => {},
    ad79Flag: false,
    setAD79Flag: () => {},
    lavaFlag: false,
    setLavaFlag: () => {}
  },
  sacrificeMessage: "",
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
  setSacrificeMessage: () => {},
  placeLavaTile: () => {}
};

export default Main;
