/** @module Player.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../Player";

const defaultProps = {
  details: { name: "Test", hand: ["card1"] }
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "presentation-player");
  expect(component.length).toBe(1);
});
