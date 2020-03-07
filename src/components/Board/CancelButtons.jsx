/** @module CancelButtons */

import React from "react";
import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@material-ui/core";

import * as types from "../../types/types";

export const CancelButtons = props => {
  const {
    flagsState: { flags, runCounter },
    placeRelatives,
    runToSquare
  } = props;

  return (
    <div data-test="cancel-buttons" className="cancel-buttons">
      {flags.includes("placing-person") && (
        <Tooltip title="Cancel Placement">
          <div>
            <IconButton onClick={() => placeRelatives(null)}>
              <i className="fas fa-street-view" />
              <span className="fas fa-ban fa-lg text-danger" />
            </IconButton>
          </div>
        </Tooltip>
      )}
      {runCounter > 0 && (
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
  placeRelatives: PropTypes.func,
  runToSquare: PropTypes.func
};

CancelButtons.defaultProps = {
  flagsState: types.flagsState.defaults,
  placeRelatives: () => {},
  runToSquare: () => {}
};

export default CancelButtons;
