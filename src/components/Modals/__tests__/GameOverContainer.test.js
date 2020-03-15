/** @module GameOverContainer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { GameOverContainerTest } from "../GameOverContainer";

const TestedComponent = GameOverContainerTest;

const defaultProps = {};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "container-game-over-modal");
  expect(component.length).toBe(1);
});
