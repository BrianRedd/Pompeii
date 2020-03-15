/** @module RecommendationHighlighter */

import React from "react";
import PropTypes from "prop-types";

import * as constant from "../../data/constants";

/**
 * @function RecommendationHighlighter
 * @description Functional Presentational component for highlighting board squares
 * @param {Object} props
 * @returns {React.Component} - Rendered component.
 */
const RecommendationHighlighter = props => {
  const { recommendationArray } = props;

  const recommendationHighlighter = recommendationArray.map(square => {
    const coords = square.space.split("_");
    const row = parseFloat(coords[0]);
    const col = parseFloat(coords[1]);
    return (
      <div
        data-test="square-recommendation"
        key={square.space}
        className="recommendation"
        style={{
          top: `${row * 110 + constant.Y_OFFSET}px`,
          left: `${col * 110 + constant.X_OFFSET + 90}px`
        }}
      >
        {square.value}
      </div>
    );
  });

  return (
    <div data-test="overlay-highlight-recommendation">
      {recommendationHighlighter}
    </div>
  );
};

RecommendationHighlighter.propTypes = {
  recommendationArray: PropTypes.arrayOf(PropTypes.string)
};

RecommendationHighlighter.defaultProps = {
  recommendationArray: []
};

export default RecommendationHighlighter;
