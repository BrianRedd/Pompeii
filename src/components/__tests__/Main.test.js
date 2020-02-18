/** @module Main.test */

import { findByTestAttr, commonSetup } from "../../utils/utilsTest";
import TestedComponent from "../Main";

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "presentation-main");
  expect(component.length).toBe(1);
});
