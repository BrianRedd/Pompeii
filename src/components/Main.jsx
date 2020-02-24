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
    flags,
    sacrificeMessage,
    setSacrificeMessage,
    pileEnabled,
    drawTile,
    lavaTile
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
          {!flags.omenFlag && !flags.ad79Flag && (
            <DeckContainer
              cardsState={cardsState}
              drawCard={drawCard}
              drawTile={drawTile}
              deckEnabled={deckEnabled}
              pileEnabled={pileEnabled}
            />
          )}
          {flags.lavaFlag ? (
            <div>LAVA! {lavaTile}</div>
          ) : (
            <PlayersContainer
              playersState={playersState}
              discardCard={discardCard}
              updatePlayerHand={updatePlayerHand}
              playPompCard={playPompCard}
              stage={messageState.stage}
            />
          )}
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
  setSacrificeMessage: PropTypes.func
};

Main.defaultProps = {
  cardsState: types.cardsState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
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
  setSacrificeMessage: () => {}
};

export default Main;
