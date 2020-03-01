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
    flagsState,
    messageState,
    tileState,
    deckEnabled,
    drawCard,
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
    placeLavaTile,
    selectRunner,
    runZone,
    runToSquare
  } = props;

  return (
    <Col data-test="presentation-main" className="main-container">
      <Row>
        <BoardContainer
          performSacrifice={performSacrifice}
          runFlag={flagsState.runCounter}
          selectRunner={selectRunner}
        />
        <div className="off-board">
          {flagsState.flags.includes("card-ad79") && <AD79Sidebar />}
          {(flags.wildLavaFlag || flags.noPlaceToPlaceFlag) && (
            <LavaTileSidebar
              lavaTile={lavaTile}
              tileState={tileState}
              highlightDangerZones={highlightDangerZones}
              setWildLavaFlag={flags.setWildLavaFlag}
              noPlaceToPlaceFlag={flags.noPlaceToPlaceFlag}
              resolveNoPlaceToPlace={flags.resolveNoPlaceToPlace}
            />
          )}
          {messageState.stage < 2 &&
            !flagsState.flags.includes("card-ad79") &&
            !flags.lavaFlag && (
              <DeckContainer drawCard={drawCard} deckEnabled={deckEnabled} />
            )}
          {messageState.stage === 2 &&
            !flagsState.flags.includes("card-ad79") &&
            !flags.wildLavaFlag &&
            !flags.noPlaceToPlaceFlag && (
              <TilesContainer
                lavaTile={flags.lavaFlag ? lavaTile : null}
                drawTile={drawTile}
                pileEnabled={pileEnabled}
              />
            )}
          <PlayersContainer
            playPompCard={playPompCard}
            stage={messageState.stage}
          />
        </div>
      </Row>
      {(() => {
        if (messageState.stage < 2) {
          return (
            <PlacementHighlighter
              gridArray={cardGrid}
              selectSquare={placePerson}
              validation={vacancy}
            />
          );
        }
        if (flagsState.runCounter) {
          return (
            <PlacementHighlighter
              gridArray={runZone}
              selectSquare={runToSquare}
              validation={() => {
                return true;
              }}
            />
          );
        }
        return (
          <PlacementHighlighter
            gridArray={dangerZone}
            selectSquare={val => {
              placeLavaTile(val);
            }}
            validation={() => {
              return true;
            }}
          />
        );
      })()}
    </Col>
  );
};

Main.propTypes = {
  flagsState: types.flagsState.types,
  messageState: types.messageState.types,
  tileState: types.tileState.types,
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  dangerZone: PropTypes.arrayOf(PropTypes.string),
  runZone: PropTypes.arrayOf(PropTypes.string),
  flags: PropTypes.shape({
    lavaFlag: PropTypes.bool,
    setLavaFlag: PropTypes.func,
    wildLavaFlag: PropTypes.bool,
    setWildLavaFlag: PropTypes.func,
    noPlaceToPlaceFlag: PropTypes.bool,
    resolveNoPlaceToPlace: PropTypes.func
  }),
  lavaTile: PropTypes.string,
  deckEnabled: PropTypes.bool,
  pileEnabled: PropTypes.bool,
  drawCard: PropTypes.func,
  drawTile: PropTypes.func,
  playPompCard: PropTypes.func,
  placePerson: PropTypes.func,
  vacancy: PropTypes.func,
  performSacrifice: PropTypes.func,
  highlightDangerZones: PropTypes.func,
  placeLavaTile: PropTypes.func,
  selectRunner: PropTypes.func,
  runToSquare: PropTypes.func
};

Main.defaultProps = {
  flagsState: types.flagsState.defaults,
  messageState: types.messageState.defaults,
  tileState: types.tileState.defaults,
  cardGrid: [],
  dangerZone: [],
  runZone: [],
  flags: {
    lavaFlag: false,
    setLavaFlag: () => {},
    wildLavaFlag: false,
    setWildLavaFlag: () => {},
    noPlaceToPlaceFlag: false,
    resolveNoPlaceToPlace: () => {}
  },
  lavaTile: "",
  deckEnabled: false,
  pileEnabled: false,
  drawCard: () => {},
  drawTile: () => {},
  playPompCard: () => {},
  placePerson: () => {},
  vacancy: () => {},
  performSacrifice: () => {},
  highlightDangerZones: () => {},
  placeLavaTile: () => {},
  selectRunner: () => {},
  runToSquare: () => {}
};

export default Main;
