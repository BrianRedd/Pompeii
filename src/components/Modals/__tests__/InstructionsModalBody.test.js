/** @module InstructionsModalBody.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../InstructionsModalBody";

const defaultProps = {};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "modal-game-rules");
  expect(component.length).toBe(1);
});
