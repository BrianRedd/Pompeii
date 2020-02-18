/** @module App.test */

import { findByTestAttr, commonSetup } from "../utils/utilsTest";
import TestedComponent from "../App";

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "component-app");
  expect(component.length).toBe(1);
});
