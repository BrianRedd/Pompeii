/** @module PlacementHighlighter */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";
import _ from "lodash";

import * as constant from "../../data/constants";
import * as types from "../../types/types";

/**
 * @function PlacementHighlighter
 * @description Functional Presentational component for highlighting board squares
 * @param {Object} props
 * @returns {React.Component} - Rendered component.
 */
const PlacementHighlighter = props => {
  const { cardGrid, gridState, placePerson } = props;

  const placementHighlighter = cardGrid.map(square => {
    if (
      _.get(gridState, `grid.${square}.occupants.length`, 0) <
      _.get(gridState, `grid.${square}.buildingCapacity`, 0)
    ) {
      const coords = square.split("_");
      const row = parseFloat(coords[0]);
      const col = parseFloat(coords[1]);
      return (
        <ButtonBase
          data-test="square-highlighted"
          key={square}
          onClick={() => placePerson(square)}
          className="highlighter"
          style={{
            top: `${row * 110 + constant.Y_OFFSET}px`,
            left: `${col * 110 + constant.X_OFFSET}px`
          }}
        >
          <div />
        </ButtonBase>
      );
    }
    return null;
  });

  return (
    <div data-test="overlay-highlight-placement">{placementHighlighter}</div>
  );
};

PlacementHighlighter.propTypes = {
  gridState: types.gridState.types,
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  placePerson: PropTypes.func
};

PlacementHighlighter.defaultProps = {
  gridState: types.gridState.defaults,
  cardGrid: [],
  placePerson: () => {}
};

export default PlacementHighlighter;
