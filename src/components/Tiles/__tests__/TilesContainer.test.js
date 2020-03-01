/** @module TilesContainer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { TilesContainerTest } from "../TilesContainer";

const TestedComponent = TilesContainerTest;

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "container-tiles");
  expect(component.length).toBe(1);
});
