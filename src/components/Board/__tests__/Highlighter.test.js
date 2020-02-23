/** @module Highlighter.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../Highlighter";

const mockGridSelect = jest.fn();

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "layer-highlight");
  expect(component.length).toBe(1);
});

describe("highlighted tiles", () => {
  let wrapper;
  let squares;
  test("default - no squares", () => {
    wrapper = commonSetup(TestedComponent);
    squares = findByTestAttr(wrapper, "square-highlighted");
    expect(squares.length).toBe(0);
  });
  test("one square", () => {
    wrapper = commonSetup(TestedComponent, {
      cardGrid: ["0-0"]
    });
    squares = findByTestAttr(wrapper, "square-highlighted");
    expect(squares.length).toBe(1);
  });
  test("two squares", () => {
    wrapper = commonSetup(TestedComponent, {
      cardGrid: ["0-0", "0-1"]
    });
    squares = findByTestAttr(wrapper, "square-highlighted");
    expect(squares.length).toBe(2);
  });
  test("clicking one places person", () => {
    wrapper = commonSetup(TestedComponent, {
      placePerson: mockGridSelect,
      cardGrid: ["0-0"]
    });
    squares = findByTestAttr(wrapper, "square-highlighted", true);
    squares.simulate("click");
    expect(mockGridSelect).toHaveBeenCalled();
  });
});
