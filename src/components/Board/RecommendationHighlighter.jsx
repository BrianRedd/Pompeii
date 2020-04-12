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
  const { recommendations } = props;

  /**
   * @function recommendationHighlighter
   * @description generates recommendation components array
   * @returns {Array}
   */
  const recommendationHighlighter = recommendations.map((square, idx) => {
    const coords = square.square.split("_");
    const row = parseFloat(coords[0]);
    const col = parseFloat(coords[1]);
    return (
      <div
        data-test="square-recommendation"
        key={square.square}
        className={`recommendation${!idx ? " top-choice" : ""}`}
        style={{
          top: `${row * 110 + constant.Y_OFFSET}px`,
          left: `${col * 110 + constant.X_OFFSET + 90}px`
        }}
      >
        {Math.round(parseFloat(square.value) * 10) / 10}
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
  recommendations: PropTypes.arrayOf(PropTypes.object)
};

RecommendationHighlighter.defaultProps = {
  recommendations: []
};

export default RecommendationHighlighter;
