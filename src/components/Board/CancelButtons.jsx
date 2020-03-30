/** @module CancelButtons */

import React from "react";
import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@material-ui/core";

import * as types from "../../types/types";
import { runToSquare } from "../Logic/runnerLogic";

const CancelButtons = props => {
  const {
    flagsState: { flags, runCount },
    messageState: { stage },
    placeRelatives,
    // runToSquare,
    toggleFlags
  } = props;

  return (
    <div data-test="cancel-buttons" className="cancel-buttons">
      <Tooltip title="Statistics">
        <div>
          <IconButton onClick={() => toggleFlags("game-stats")}>
            <i className="fas fa-chart-bar" />
          </IconButton>
        </div>
      </Tooltip>
      {flags.includes("placing-person") && stage === 1 && (
        <Tooltip title="Cancel Placement">
          <div>
            <IconButton onClick={() => placeRelatives(null)}>
              <i className="fas fa-street-view" />
              <span className="fas fa-ban fa-lg text-danger" />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {runCount > 0 && (
        <Tooltip title="Cancel Run">
          <div>
            <IconButton onClick={() => runToSquare(null)}>
              <i className="fas fa-running" />
              <span className="fas fa-ban fa-lg text-danger" />
            </IconButton>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

CancelButtons.propTypes = {
  flagsState: types.flagsState.types,
  messageState: types.messageState.types,
  placeRelatives: PropTypes.func,
  // runToSquare: PropTypes.func,
  toggleFlags: PropTypes.func
};

CancelButtons.defaultProps = {
  flagsState: types.flagsState.defaults,
  messageState: types.messageState.defaults,
  placeRelatives: () => {},
  // runToSquare: () => {},
  toggleFlags: () => {}
};

export default CancelButtons;
