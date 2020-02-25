/** @module Tiles.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../Tiles";

const mockDraw = jest.fn();

const defaultProps = {
  drawTile: mockDraw,
  deckSizes: {
    deck: 10,
    discard: 0
  }
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "presentation-tiles");
  expect(component.length).toBe(1);
});

describe("draw pile", () => {
  let wrapper;
  let pile;
  let deck;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, defaultProps);
    pile = findByTestAttr(wrapper, "tile-pile-deck");
    deck = findByTestAttr(wrapper, "tile-pile");
  });
  test("renders", () => {
    expect(pile.length).toBe(1);
  });
  test("clickable by default", () => {
    expect(deck.length).toBe(1);
  });
  test("clicking draws tile", () => {
    deck.simulate("click");
    expect(mockDraw).toHaveBeenCalled();
  });
});
