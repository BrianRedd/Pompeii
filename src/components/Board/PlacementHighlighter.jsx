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
  const { cardGrid, placePerson } = props;

  const placementHighlighter = cardGrid.map(square => {
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
  });

  return (
    <div data-test="overlay-highlight-placement">{placementHighlighter}</div>
  );
};

PlacementHighlighter.propTypes = {
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  placePerson: PropTypes.func
};

PlacementHighlighter.defaultProps = {
  cardGrid: [],
  placePerson: () => {}
};

export default PlacementHighlighter;
