/** @module GameStatisticsContainer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { GameStatisticsContainerTest } from "../GameStatisticsContainer";

const TestedComponent = GameStatisticsContainerTest;

const mockToggle = jest.fn();

const defaultProps = {
  flagsState: {
    flags: ["game-stats"]
  },
  toggleFlags: mockToggle
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "container-statistics-modal");
  expect(component.length).toBe(1);
});

test("submit button calls toggle", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps, true);
  const button = findByTestAttr(wrapper, "button-submit", true);
  expect(button.length).toBe(1);
  button.simulate("click");
  expect(mockToggle).toHaveBeenCalled();
});
