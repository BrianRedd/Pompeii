/** @module StartGameContainer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { StartGameContainerTest } from "../StartGameContainer";

const TestedComponent = StartGameContainerTest;

const defaultProps = {};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "container-start-game");
  expect(component.length).toBe(1);
});
