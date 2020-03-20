/** @module RecommendationHighlighter */

import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import * as constant from "../../data/constants";

/**
 * @function RecommendationHighlighter
 * @description Functional Presentational component for highlighting board squares
 * @param {Object} props
 * @returns {React.Component} - Rendered component.
 */
const RecommendationHighlighter = props => {
  const { recommendationArray } = props;

  const sortedArray = recommendationArray.sort((a, b) =>
    a.value < b.value ? 1 : -1
  );
  console.log("recommendationArray:", recommendationArray, sortedArray);

  /**
   * @function TopCoordinatesDisplay
   * @description display coordinates at top of map
   * @returns {React.Component}
   */
  const TopCoordinatesDisplay = () => {
    const topCoords = [];
    for (let i = 0; i < 11; i += 1) {
      topCoords.push(
        <div
          data-test="square-coordinate"
          key={i}
          className="coordinate_display"
          style={{
            top: "90px",
            left: `${i * 110 + constant.X_OFFSET + 45}px`
          }}
        >
          {i}
        </div>
      );
    }
    return topCoords;
  };

  /**
   * @function LeftCoordinatesDisplay
   * @description display coordinates at left of map
   * @returns {React.Component}
   */
  const LeftCoordinatesDisplay = () => {
    const topCoords = [];
    for (let i = 0; i < 7; i += 1) {
      topCoords.push(
        <div
          data-test="square-coordinate"
          key={i}
          className="coordinate_display"
          style={{
            top: `${i * 110 + constant.Y_OFFSET + 45}px`,
            left: "30px"
          }}
        >
          {i}
        </div>
      );
    }
    return topCoords;
  };

  /**
   * @function recommendationHighlighter
   * @description generates recommendation components array
   * @returns {Array}
   */
  const recommendationHighlighter = sortedArray.map((square, idx) => {
    const coords = square.space.split("_");
    const row = parseFloat(coords[0]);
    const col = parseFloat(coords[1]);
    return (
      <div
        data-test="square-recommendation"
        key={square.space}
        className={`recommendation${!idx ? " top-choice" : ""}`}
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
      <TopCoordinatesDisplay />
      <LeftCoordinatesDisplay />
      {recommendationHighlighter}
    </div>
  );
};

RecommendationHighlighter.propTypes = {
  recommendationArray: PropTypes.arrayOf(PropTypes.object)
};

RecommendationHighlighter.defaultProps = {
  recommendationArray: []
};

export default RecommendationHighlighter;
