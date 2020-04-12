/** @module InstructionsModal.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { InstructionsModalTest } from "../InstructionsModal";

const TestedComponent = InstructionsModalTest;

const mockToggle = jest.fn();

const defaultProps = {
  flagsState: { flags: ["rules-modal"] },
  toggleFlags: mockToggle
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "modal-game-rules");
  expect(component.length).toBe(1);
});

describe("continue button", () => {
  let wrapper;
  let button;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, defaultProps);
    button = findByTestAttr(wrapper, "button-close");
  });
  test("button renders", () => {
    expect(button.length).toBe(1);
  });
  test("clicking button closes modal", () => {
    button.simulate("click");
    expect(mockToggle).toHaveBeenCalledWith("rules-modal");
  });
});
