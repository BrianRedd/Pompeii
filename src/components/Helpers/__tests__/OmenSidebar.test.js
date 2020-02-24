/** @module OmenSidebar.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../OmenSidebar";

const mockSetFlag = jest.fn();
const mockSetMessage = jest.fn();

const defaultProps = {
  name: "Test",
  setOmenFlag: mockSetFlag,
  setSacrificeMessage: mockSetMessage
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "sidebar-omen");
  expect(component.length).toBe(1);
});

describe("button", () => {
  let wrapper;
  let button;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, defaultProps);
    button = findByTestAttr(wrapper, "button-omen");
  });
  test("renders without error", () => {
    expect(button.length).toBe(1);
  });
  test("clicking closes sidebar and clears message", () => {
    button.simulate("click");
    expect(mockSetFlag).toHaveBeenCalled();
    expect(mockSetMessage).toHaveBeenCalled();
  });
});

describe("message", () => {
  let wrapper;
  let caption;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, defaultProps);
    caption = findByTestAttr(wrapper, "caption");
  });
  test("default", () => {
    expect(caption.length).toBe(1);
    expect(caption.text()).toBe(
      "Test, choose a person to SACRIFICE to the Gods!"
    );
  });
  test("message provided", () => {
    wrapper = commonSetup(TestedComponent, {
      ...defaultProps,
      sacrificeMessage: "Test message"
    });
    caption = findByTestAttr(wrapper, "caption");
    expect(caption.text()).toBe("Test message");
  });
});
