/** @module MainContainer.test */

import { findByTestAttr, commonSetup } from "../../utils/utilsTest";
import { MainContainerTest } from "../MainContainer";

const TestedComponent = MainContainerTest;

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "container-main");
  expect(component.length).toBe(1);
});
