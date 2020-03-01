/** @module BoardContainer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { BoardContainerTest } from "../BoardContainer";

const TestedComponent = BoardContainerTest;

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "container-board");
  expect(component.length).toBe(1);
});
