/** @module TilesContainer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../TilesContainer";

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "container-tiles");
  expect(component.length).toBe(1);
});
