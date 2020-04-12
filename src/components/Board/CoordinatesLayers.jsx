/** @module CoordinatesLayers */

import React from "react";

import * as constant from "../../data/constants";

/**
 * @function TopCoordinatesDisplay
 * @description display coordinates at top of map
 * @returns {React.Component}
 */
export const TopCoordinatesDisplay = () => {
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
export const LeftCoordinatesDisplay = () => {
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
