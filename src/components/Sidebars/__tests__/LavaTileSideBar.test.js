/** @module LavaTileSideBar.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../LavaTileSideBar";

const mockNoPlace = jest.fn();
const mockHighlight = jest.fn();
const mockSetTile = jest.fn();

const defaultProps = {
  tileState: { tiles: { TEST: { wilds: ["w1", "w2"] } } },
  lavaTile: "TEST",
  noPlaceToPlaceFlag: false,
  resolveNoPlaceToPlace: mockNoPlace,
  highlightDangerZones: mockHighlight,
  setWildLavaFlag: mockSetTile
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "sidebar-lavatile");
  expect(component.length).toBe(1);
});

describe("wilds tiles", () => {
  let wrapper;
  let button;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, defaultProps);
    button = findByTestAttr(wrapper, "button-lavatile");
  });
  test("renders without error", () => {
    expect(button.length).toBe(2);
  });
  test("clicking tile selected appropriate highlight and updates flag", () => {
    button.at(0).simulate("click");
    expect(mockHighlight).toHaveBeenCalledWith("w1");
    expect(mockSetTile).toHaveBeenCalled();
  });
});

describe("no place to place tile", () => {
  let wrapper;
  let button;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, {
      ...defaultProps,
      noPlaceToPlaceFlag: true
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
