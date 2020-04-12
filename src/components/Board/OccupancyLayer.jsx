/** @module OccupancyLayer */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase, Tooltip } from "@material-ui/core";
import _ from "lodash";

import * as types from "../../types/types";
import { selectRunner } from "../Logic/runnerLogic";
import * as constant from "../../data/constants";

import { performSacrifice } from "../Logic/placePeopleLogic";

const OccupancySquare = ({
  square,
  playersState,
  runCount,
  messageState,
  grid,
  selectedPerson
}) => {
  const occupancySquare = _.get(grid, `${square}.occupants`, []).map(
    (person, idx) => {
      if (_.get(person, "id") !== _.get(selectedPerson, "id")) {
        const key = `${person.id}`;
        const color = `rgb(${_.get(
          playersState,
          `details.${person.player}.color`
        )})`;
        const playerName = `${_.get(
          playersState,
          `details.${person.player}.name`
        )}`;
        let style = {
          backgroundColor: color
        };
        const offSetArray = _.get(grid, `${square}.offSets`, []);

        if (messageState.stage < 2 && offSetArray.length > 0) {
          style = {
            ...style,
            position: "absolute",
            left: `${_.get(offSetArray, `[${idx}][0]`, 0)}px`,
            top: `${_.get(offSetArray, `[${idx}][1]`, 0)}px`
          };
        }
        return (
          <Tooltip
            key={key}
            title={`${playerName}, ${person.id}`}
            placement="top"
            arrow
          >
            <ButtonBase
              className={`person ${person.id}${
                (playersState.players[playersState.turn] === person.player &&
                  runCount) ||
                (playersState.players[playersState.turn] !== person.player &&
                  !runCount)
                  ? " highlight"
                  : ""
              }`}
              style={style}
              onClick={() => {
                if (runCount) {
                  selectRunner(person, square);
                } else {
                  performSacrifice(person, square);
                }
              }}
            >
              <span className={`fas fa-${person.gender} fa-lg`} />
            </ButtonBase>
          </Tooltip>
        );
      }
      return null;
    }
  );
  return <div>{occupancySquare}</div>;
};

OccupancySquare.propTypes = {
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  grid: types.gridSquare.types,
  selectedPerson: types.occupant.types,
  square: PropTypes.string,
  runCount: PropTypes.number
};

OccupancySquare.defaultProps = {
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  grid: types.gridSquare.defaults,
  selectedPerson: {},
  square: "",
  runCount: 0
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
    runCount,
    messageState,
    selectedPerson
  } = props;

  const occupancy = Object.keys(grid).map(square => {
    const coords = square.split("_");
    const row = parseFloat(coords[0]);
    const col = parseFloat(coords[1]);
    return (
      <div
        key={square}
        data-test="square-occupancy"
        className={`occupancy-square ${square}`}
        style={{
          top: `${row * 110 + constant.Y_OFFSET}px`,
          left: `${col * 110 + constant.X_OFFSET}px`
        }}
      >
        {_.get(grid, `${square}.lava`) && (
          <img
            alt="Lava"
            className="lava-tile"
            src={`./assets/tiles/${grid[square].lava}.png`}
          />
        )}
        {_.get(grid, `${square}.occupants.length`) > 0 && (
          <OccupancySquare
            square={square}
            playersState={playersState}
            runCount={runCount}
            selectRunner={selectRunner}
            messageState={messageState}
            grid={grid}
            selectedPerson={selectedPerson}
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
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  selectedPerson: types.occupant.types,
  runCount: PropTypes.number
};

OccupancyLayer.defaultProps = {
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  selectedPerson: {},
  runCount: 0
};

export default OccupancyLayer;
