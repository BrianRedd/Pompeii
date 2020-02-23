/** @module OccupancyLayer */

import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import * as types from "../../types/types";
import * as constant from "../../data/constants";

const OccupancySquare = ({ occupants, playersState }) => {
  const occupancySquare = occupants.map((person, idx) => {
    const key = `${person.player}-${person.gender}-${idx}`;
    const color = `${_.get(playersState, `details.${person.player}.color`)}`;
    return (
      <div
        key={key}
        className="person"
        style={{
          backgroundColor: color
        }}
      >
        <span className={`fas fa-${person.gender} fa-lg`} />
      </div>
    );
  });
  return <div>{occupancySquare}</div>;
};

OccupancySquare.propTypes = {
  playersState: types.playersState.types,
  occupants: PropTypes.arrayOf(PropTypes.object)
};

OccupancySquare.defaultProps = {
  playersState: types.playersState.defaults,
  occupants: []
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
    playersState
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
        {_.get(grid, `${square}.occupants.length`) > 0 && (
          <OccupancySquare
            occupants={_.get(grid, `${square}.occupants`, [])}
            playersState={playersState}
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
  playersState: types.playersState.types
};

OccupancyLayer.defaultProps = {
  gridState: types.gridState.defaults,
  playersState: types.playersState.defaults
};

export default OccupancyLayer;
