/** @module BoardContainer */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as types from "../../types/types";

import Board from "./Board";
import {
  TopCoordinatesDisplay,
  LeftCoordinatesDisplay
} from "./CoordinatesLayers";
import AnimatedPieceLayer from "./AnimatedPieceLayer";
import OccupancyLayer from "./OccupancyLayer";
import CancelButtons from "./CancelButtons";

const mapStateToProps = state => {
  return {
    flagsState: state.flagsState,
    gamePlayState: state.gamePlayState,
    gridState: state.gridState,
    messageState: state.messageState,
    playersState: state.playersState
  };
};

/**
 * @function BoardContainer
 * @description Functional Container component for Board
 * @returns {React.Component} - Rendered component.
 */
const BoardContainer = props => {
  const {
    flagsState,
    gamePlayState,
    gridState,
    messageState,
    playersState,
    placeRelatives,
    toggleFlags
  } = props;
  return (
    <div data-test="container-board" className="board-container">
      <Board messageState={messageState} />
      <TopCoordinatesDisplay />
      <LeftCoordinatesDisplay />
      <OccupancyLayer
        gridState={gridState}
        playersState={playersState}
        runCount={flagsState.runCount}
        messageState={messageState}
        selectedPerson={gamePlayState.selectedPerson}
      />
      {gamePlayState.selectedPerson && (
        <AnimatedPieceLayer
          gamePlayState={gamePlayState}
          playersState={playersState}
        />
      )}
      <CancelButtons
        flagsState={flagsState}
        placeRelatives={placeRelatives}
        toggleFlags={toggleFlags}
        messageState={messageState}
      />
    </div>
  );
};

BoardContainer.propTypes = {
  flagsState: types.flagsState.types,
  gamePlayState: types.gamePlayState.types,
  gridState: types.gridState.types,
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  placeRelatives: PropTypes.func,
  toggleFlags: PropTypes.func
};

BoardContainer.defaultProps = {
  flagsState: types.flagsState.defaults,
  gamePlayState: types.gamePlayState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  placeRelatives: () => {},
  toggleFlags: () => {}
};

export const BoardContainerTest = BoardContainer;
export default connect(mapStateToProps)(BoardContainer);
