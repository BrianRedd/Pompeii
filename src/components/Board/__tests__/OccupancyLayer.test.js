/** @module OccupancyLayer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../OccupancyLayer";

const defaultProps = {
  gridState: {
    grid: {
      "0_0": {
        occupants: []
      }
    }
  }
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "overlay-occupancy");
  expect(component.length).toBe(1);
});
