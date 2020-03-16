/** @module PlacementHighlighter */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";

import * as constant from "../../data/constants";

/**
 * @function PlacementHighlighter
 * @description Functional Presentational component for highlighting board squares
 * @param {Object} props
 * @returns {React.Component} - Rendered component.
 */
const PlacementHighlighter = props => {
  const { gridArray, validation, selectSquare, activePlayer } = props;
  // console.log("activePlayer:", activePlayer);

  const placementHighlighter = gridArray.map(square => {
    if (validation(square)) {
      const coords = square.split("_");
      const row = parseFloat(coords[0]);
      const col = parseFloat(coords[1]);
      return (
        <ButtonBase
          data-test="square-highlighted"
          key={square}
          onClick={() => selectSquare(square)}
          className={`highlighter ${activePlayer}`}
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
  gridArray: PropTypes.arrayOf(PropTypes.string),
  activePlayer: PropTypes.string,
  selectSquare: PropTypes.func,
  validation: PropTypes.func
};

PlacementHighlighter.defaultProps = {
  gridArray: [],
  activePlayer: "",
  selectSquare: () => {},
  validation: () => {}
};

export default PlacementHighlighter;
