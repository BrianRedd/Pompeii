/** @module AD79Sidebar.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../AD79Sidebar";

const mockSetFlag = jest.fn();

const defaultProps = {
  messageState: { stage: 0 },
  setAD79Flag: mockSetFlag
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "sidebar-ad79");
  expect(component.length).toBe(1);
});

describe("button", () => {
  let wrapper;
  let button;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, defaultProps);
    button = findByTestAttr(wrapper, "button-ad79");
  });
  test("renders without error", () => {
    expect(button.length).toBe(1);
  });
  test("clicking closes sidebar", () => {
    button.simulate("click");
    expect(mockSetFlag).toHaveBeenCalled();
  });
});
