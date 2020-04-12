/** @module Main */

import React from "react";
import PropTypes from "prop-types";
import { SnackbarProvider } from "notistack";
import { Col, Row } from "reactstrap";
import _ from "lodash";

import * as types from "../types/types";
import { playPompCard } from "./Logic/cardLogic";
import { runToSquare } from "./Logic/runnerLogic";

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
import InstructionsModal from "./Modals/InstructionsModal";
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
    gamePlayState,
    gridState,
    messageState,
    playersState,
    tileState,
    deckEnabled,
    cardGrid,
    vacancy,
    resolveNoPlaceToPlace,
    pileEnabled,
    dangerZone,
    placeLavaTile,
    placeRelatives,
    toggleFlags,
    placePerson
  } = props;

  return (
    <SnackbarProvider maxSnack={3}>
      <SnackbarNotifier />
      <Col data-test="presentation-main" className="main-container">
        {messageState.stage === 2 && (
          <React.Fragment>
            <div className="volcano-bg" />
            <div className="eruption flashit" />
          </React.Fragment>
        )}
        <Row>
          <BoardContainer
            runFlag={flagsState.runCount}
            placeRelatives={placeRelatives}
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
                  <DeckContainer deckEnabled={deckEnabled} />
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
        {_.get(gamePlayState, "gameSettings.showStrategyValues") &&
          messageState.stage === 2 && (
            <RecommendationHighlighter
              recommendations={_.get(gamePlayState, "recommendations", [])}
            />
          )}
        {(() => {
          if (
            messageState.stage < 2 &&
            !(
              _.get(playersState, `details.${playersState.activePlayer}.ai`) ||
              _.get(gamePlayState, "gameSettings.showStrategyValues")
            )
          ) {
            return (
              <PlacementHighlighter
                gridArray={cardGrid}
                selectSquare={placePerson}
                validation={vacancy}
                activePlayer={playersState.activePlayer}
              />
            );
          }
          if (
            flagsState.runCount &&
            !(
              _.get(playersState, `details.${playersState.activePlayer}.ai`) ||
              _.get(gamePlayState, "gameSettings.showStrategyValues")
            )
          ) {
            return (
              <PlacementHighlighter
                gridArray={gridState.runZone}
                selectSquare={runToSquare}
                validation={() => {
                  return true;
                }}
                activePlayer={playersState.activePlayer}
              />
            );
          }
          if (
            !(
              _.get(playersState, `details.${playersState.activePlayer}.ai`) ||
              _.get(gamePlayState, "gameSettings.showStrategyValues")
            )
          ) {
            return (
              <PlacementHighlighter
                gridArray={dangerZone}
                selectSquare={placeLavaTile}
                validation={() => {
                  return true;
                }}
                activePlayer={playersState.activePlayer}
              />
            );
          }
          return <div />;
        })()}
      </Col>
      {flagsState.flags.includes("game-over") && <GameOverContainer />}
      {flagsState.flags.includes("game-stats") && <GameStatisticsContainer />}
      {flagsState.flags.includes("game-start") && <StartGameContainer />}
      {flagsState.flags.includes("rules-modal") && <InstructionsModal />}
    </SnackbarProvider>
  );
};

Main.propTypes = {
  flagsState: types.flagsState.types,
  gamePlayState: types.gamePlayState.types,
  gridState: types.gridState.types,
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  tileState: types.tileState.types,
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  dangerZone: PropTypes.arrayOf(PropTypes.string),
  deckEnabled: PropTypes.bool,
  pileEnabled: PropTypes.bool,
  resolveNoPlaceToPlace: PropTypes.func,
  vacancy: PropTypes.func,
  placeLavaTile: PropTypes.func,
  placeRelatives: PropTypes.func,
  toggleFlags: PropTypes.func,
  placePerson: PropTypes.func
};

Main.defaultProps = {
  flagsState: types.flagsState.defaults,
  gamePlayState: types.gamePlayState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  tileState: types.tileState.defaults,
  cardGrid: [],
  dangerZone: [],
  deckEnabled: false,
  pileEnabled: false,
  resolveNoPlaceToPlace: () => {},
  vacancy: () => {},
  placeLavaTile: () => {},
  placeRelatives: () => {},
  toggleFlags: () => {},
  placePerson: () => {}
};

export default Main;
