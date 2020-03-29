/** @module LavaTileSideBar.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { LavaTileSideBarTest } from "../LavaTileSidebar";

const TestedComponent = LavaTileSideBarTest;

const mockNoPlace = jest.fn();
const mockHighlight = jest.fn();
const mockToggle = jest.fn();

const defaultProps = {
  tileState: { tiles: { TEST: { wilds: ["w1", "w2"] } } },
  lavaTile: "TEST",
  flagsState: { flags: ["wild-lava-tile"] },
  resolveNoPlaceToPlace: mockNoPlace,
  highlightDangerZones: mockHighlight,
  toggleFlags: mockToggle
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "sidebar-lavatile");
  expect(component.length).toBe(1);
});

// describe("wilds tiles", () => {
//   let wrapper;
//   let button;
//   beforeEach(() => {
//     wrapper = commonSetup(TestedComponent, defaultProps);
//     button = findByTestAttr(wrapper, "button-lavatile");
//   });
//   test("renders without error", () => {
//     expect(button.length).toBe(2);
//   });
//   test("clicking tile selected appropriate highlight and updates flag", () => {
//     button.at(0).simulate("click");
//     expect(mockHighlight).toHaveBeenCalledWith("w1");
//     expect(mockToggle).toHaveBeenCalled();
//   });
// });

describe("no place to place tile", () => {
  let wrapper;
  let button;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, {
      ...defaultProps,
      flagsState: { flags: ["no-place-to-place"] }
    });
    button = findByTestAttr(wrapper, "button-continue");
  });
  test("renders without error", () => {
    expect(button.length).toBe(1);
  });
  test("clicking tile selected appropriate highlight and updates flag", () => {
    button.at(0).simulate("click");
    expect(mockNoPlace).toHaveBeenCalled();
  });
});
