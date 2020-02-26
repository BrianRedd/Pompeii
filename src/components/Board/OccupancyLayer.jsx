/** @module OccupancyLayer */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase, Tooltip } from "@material-ui/core";
import _ from "lodash";

import * as types from "../../types/types";
import * as constant from "../../data/constants";

const OccupancySquare = ({
  occupants,
  square,
  playersState,
  performSacrifice,
  runFlag,
  selectRunner
}) => {
  const occupancySquare = occupants.map((person, idx) => {
    const key = `${person.player}-${person.gender}-${idx}`;
    const color = `rgb(${_.get(
      playersState,
      `details.${person.player}.color`
    )})`;
    const playerName = `${_.get(
      playersState,
      `details.${person.player}.name`
    )}`;
    return (
      <Tooltip key={key} title={`${playerName}`} placement="top" arrow>
        <ButtonBase
          className={`person${
            (playersState.players[playersState.turn] === person.player &&
              runFlag) ||
            (playersState.players[playersState.turn] !== person.player &&
              !runFlag)
              ? " highlight"
              : ""
          }`}
          style={{
            backgroundColor: color
          }}
          onClick={() => {
            if (runFlag) {
              selectRunner(key, square);
            } else {
              performSacrifice(key, square);
            }
          }}
        >
          <span className={`fas fa-${person.gender} fa-lg`} />
        </ButtonBase>
      </Tooltip>
    );
  });
  return <div>{occupancySquare}</div>;
};

OccupancySquare.propTypes = {
  playersState: types.playersState.types,
  occupants: PropTypes.arrayOf(PropTypes.object),
  square: PropTypes.string,
  runFlag: PropTypes.number,
  selectRunner: PropTypes.func,
  performSacrifice: PropTypes.func
};

OccupancySquare.defaultProps = {
  playersState: types.playersState.defaults,
  occupants: [],
  square: "",
  runFlag: 0,
  selectRunner: () => {},
  performSacrifice: () => {}
};

/**
 * @function OccupancyLayer
 * @description Functional Presentational component for occupants of board squares
 * @param {Object} props
 * @returns {React.Component} - Rendered component.
 */
const OccupancyLayer = props => {
  const {
    gridState: { grid },
    playersState,
    performSacrifice,
    runFlag,
    selectRunner
  } = props;

  const occupancy = Object.keys(grid).map(square => {
    const coords = square.split("_");
    const row = parseFloat(coords[0]);
    const col = parseFloat(coords[1]);
    return (
      <div
        key={square}
        data-test="square-occupancy"
        className="occupancy-square"
        style={{
          top: `${row * 110 + constant.Y_OFFSET}px`,
          left: `${col * 110 + constant.X_OFFSET}px`
        }}
      >
        {_.get(grid, `${square}.lava`) && (
          <img alt="Lava" src={`/assets/tiles/${grid[square].lava}.png`} />
        )}
        {_.get(grid, `${square}.occupants.length`) > 0 && (
          <OccupancySquare
            occupants={_.get(grid, `${square}.occupants`, [])}
            square={square}
            playersState={playersState}
            performSacrifice={performSacrifice}
            runFlag={runFlag}
            selectRunner={selectRunner}
          />
        )}
      </div>
    );
  });

  return (
    <div data-test="overlay-occupancy" className="overlay-occupancy">
      {occupancy}
    </div>
  );
};

OccupancyLayer.propTypes = {
  gridState: types.gridState.types,
  playersState: types.playersState.types,
  runFlag: PropTypes.number,
  performSacrifice: PropTypes.func,
  selectRunner: PropTypes.func
};

OccupancyLayer.defaultProps = {
  gridState: types.gridState.defaults,
  playersState: types.playersState.defaults,
  runFlag: 0,
  performSacrifice: () => {},
  selectRunner: () => {}
};

export default OccupancyLayer;
