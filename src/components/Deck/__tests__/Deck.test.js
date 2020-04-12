/** @module Deck.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../Deck";

const mockDraw = jest.fn();

const defaultProps = {
  topDiscard: null,
  drawCard: mockDraw,
  deckSizes: {
    deck: 10,
    discard: 0
  }
};

const cardDrawnProps = {
  ...defaultProps,
  topDiscard: "Test",
  deckSizes: {
    deck: 0,
    discard: 10
  }
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "presentation-deck");
  expect(component.length).toBe(1);
});

describe("draw pile", () => {
  let wrapper;
  let pile;
  let empty;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, defaultProps);
    pile = findByTestAttr(wrapper, "card-pile-deck");
    empty = findByTestAttr(wrapper, "card-pile-deck-empty");
  });
  test("renders", () => {
    expect(pile.length).toBe(1);
    expect(empty.length).toBe(0);
  });
});

describe("discard pile", () => {
  let wrapper;
  let pile;
  let discard;
  let empty;
  beforeEach(() => {
    wrapper = commonSetup(TestedComponent, defaultProps);
    pile = findByTestAttr(wrapper, "card-pile-discard");
    discard = findByTestAttr(wrapper, "card-discard");
    empty = findByTestAttr(wrapper, "card-pile-discard-empty");
  });
  test("renders", () => {
    expect(pile.length).toBe(1);
  });
  test("empty by default", () => {
    expect(discard.length).toBe(0);
    expect(empty.length).toBe(1);
  });
  test("top discard card displayed if there is one", () => {
    wrapper = commonSetup(TestedComponent, cardDrawnProps);
    discard = findByTestAttr(wrapper, "card-discard");
    empty = findByTestAttr(wrapper, "card-pile-discard-empty");
    expect(discard.length).toBe(1);
    expect(empty.length).toBe(0);
  });
});
