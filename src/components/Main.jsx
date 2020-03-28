/** @module Main */

import React from "react";
import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack";
import { Col, Row } from "reactstrap";

import * as types from "../types/types";
import { playPompCard /* , placePerson */ } from "./Logic/cardLogic";

import BoardContainer from "./Board/BoardContainer";
import DeckContainer from "./Deck/DeckContainer";
import TilesContainer from "./Tiles/TilesContainer";
import PlayersContainer from "./Player/PlayersContainer";
import PlacementHighlighter from "./Board/PlacementHighlighter";
import AD79Sidebar from "./Sidebars/AD79Sidebar";
import LavaTileSidebar from "./Sidebars/LavaTileSidebar";
import SnackbarNotifier from "./Helpers/SnackbarNotifier";
import GameOverContainer from "./Modals/GameOverContainer";
import StartGameContainer from "./Modals/StartGameContainer";
import GameStatisticsContainer from "./Modals/GameStatisticsContainer";
import RecommendationHighlighter from "./Board/RecommendationHighlighter";

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
    cardGrid,
    vacancy,
    performSacrifice,
    resolveNoPlaceToPlace,
    pileEnabled,
    dangerZone,
    placeLavaTile,
    selectRunner,
    runZone,
    runToSquare,
    placeRelatives,
    toggleFlags,
    activePlayer,
    recommendations,
    placePerson
  } = props;

  return (
    <SnackbarProvider maxSnack={3}>
      <SnackbarNotifier />
      <Col data-test="presentation-main" className="main-container">
        <Row>
          <BoardContainer
            performSacrifice={performSacrifice}
            runFlag={flagsState.runCount}
            selectRunner={selectRunner}
            placeRelatives={placeRelatives}
            runToSquare={runToSquare}
            toggleFlags={toggleFlags}
          />
          {!flagsState.flags.includes("game-start") && (
            <div className="off-board">
              {flagsState.flags.includes("card-ad79") && <AD79Sidebar />}
              {(flagsState.flags.includes("wild-lava-tile") ||
                flagsState.flags.includes("no-place-to-place")) && (
                <LavaTileSidebar
                  tileState={tileState}
                  resolveNoPlaceToPlace={resolveNoPlaceToPlace}
                />
              )}
              {messageState.stage < 2 &&
                !flagsState.flags.includes("card-ad79") &&
                !flagsState.flags.includes("lava-tile") && (
                  <DeckContainer
                    drawCard={drawCard}
                    deckEnabled={deckEnabled}
                  />
                )}
              {messageState.stage === 2 &&
                !flagsState.flags.includes("card-ad79") &&
                !flagsState.flags.includes("wild-lava-tile") &&
                !flagsState.flags.includes("no-place-to-place") && (
                  <TilesContainer pileEnabled={pileEnabled} />
                )}
              <PlayersContainer
                playPompCard={playPompCard}
                stage={messageState.stage}
              />
            </div>
          )}
        </Row>
        <RecommendationHighlighter recommendations={recommendations} />
        {(() => {
          if (messageState.stage < 2) {
            return (
              <PlacementHighlighter
                gridArray={cardGrid}
                selectSquare={placePerson}
                validation={vacancy}
                activePlayer={activePlayer}
              />
            );
          }
          if (flagsState.runCount) {
            return (
              <PlacementHighlighter
                gridArray={runZone}
                selectSquare={runToSquare}
                validation={() => {
                  return true;
                }}
                activePlayer={activePlayer}
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
              activePlayer={activePlayer}
            />
          );
        })()}
      </Col>
      {flagsState.flags.includes("game-over") && <GameOverContainer />}
      {flagsState.flags.includes("game-stats") && <GameStatisticsContainer />}
      {flagsState.flags.includes("game-start") && <StartGameContainer />}
    </SnackbarProvider>
  );
};

Main.propTypes = {
  flagsState: types.flagsState.types,
  messageState: types.messageState.types,
  tileState: types.tileState.types,
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  dangerZone: PropTypes.arrayOf(PropTypes.string),
  runZone: PropTypes.arrayOf(PropTypes.string),
  recommendations: PropTypes.arrayOf(PropTypes.object),
  activePlayer: PropTypes.string,
  deckEnabled: PropTypes.bool,
  pileEnabled: PropTypes.bool,
  resolveNoPlaceToPlace: PropTypes.func,
  drawCard: PropTypes.func,
  vacancy: PropTypes.func,
  performSacrifice: PropTypes.func,
  placeLavaTile: PropTypes.func,
  selectRunner: PropTypes.func,
  runToSquare: PropTypes.func,
  placeRelatives: PropTypes.func,
  toggleFlags: PropTypes.func,
  placePerson: PropTypes.func
};

Main.defaultProps = {
  flagsState: types.flagsState.defaults,
  messageState: types.messageState.defaults,
  tileState: types.tileState.defaults,
  cardGrid: [],
  dangerZone: [],
  runZone: [],
  recommendations: [],
  activePlayer: "",
  deckEnabled: false,
  pileEnabled: false,
  resolveNoPlaceToPlace: () => {},
  drawCard: () => {},
  vacancy: () => {},
  performSacrifice: () => {},
  placeLavaTile: () => {},
  selectRunner: () => {},
  runToSquare: () => {},
  placeRelatives: () => {},
  toggleFlags: () => {},
  placePerson: () => {}
};

export default Main;
