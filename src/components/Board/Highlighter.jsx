/** @module Highlighter */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";

import * as constant from "../../data/constants";

/**
 * @function Highlighter
 * @description Functional Presentational component for highlighting board squares
 * @param {Object} props
 * @returns {React.Component} - Rendered component.
 */
const Highlighter = props => {
  const { cardGrid, placePerson } = props;

  const highLighter = cardGrid.map(square => {
    const coords = square.split("-");
    const x = parseFloat(coords[0]);
    const y = parseFloat(coords[1]);
    return (
      <ButtonBase
        key={square}
        onClick={placePerson}
        className="highlighter"
        style={{
          left: `${x * 110 + constant.X_OFFSET}px`,
          top: `${y * 110 + constant.Y_OFFSET}px`
        }}
      >
        <div data-test="square-highlighted" />
      </ButtonBase>
    );
  });

  return <React.Fragment>{highLighter}</React.Fragment>;
};

Highlighter.propTypes = {
  cardGrid: PropTypes.arrayOf(PropTypes.string),
  placePerson: PropTypes.func
};

Highlighter.defaultProps = {
  cardGrid: [],
  placePerson: () => {}
};

export default Highlighter;
