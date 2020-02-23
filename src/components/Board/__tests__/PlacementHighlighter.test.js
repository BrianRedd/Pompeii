/** @module PlacementHighlighter.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../PlacementHighlighter";

const mockGridSelect = jest.fn();
const mockVacancy = jest.fn(() => {
  return true;
});

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "overlay-highlight-placement");
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
      vacancy: mockVacancy,
      cardGrid: ["0_0"]
    });
    squares = findByTestAttr(wrapper, "square-highlighted");
    expect(squares.length).toBe(1);
  });
  test("two squares", () => {
    wrapper = commonSetup(TestedComponent, {
      vacancy: mockVacancy,
      cardGrid: ["0_0", "0_1"]
    });
    squares = findByTestAttr(wrapper, "square-highlighted");
    expect(squares.length).toBe(2);
  });
  test("clicking one places person", () => {
    wrapper = commonSetup(TestedComponent, {
      placePerson: mockGridSelect,
      vacancy: mockVacancy,
      cardGrid: ["0_0"]
    });
    squares = findByTestAttr(wrapper, "square-highlighted", true);
    squares.simulate("click");
    expect(mockGridSelect).toHaveBeenCalled();
  });
});
