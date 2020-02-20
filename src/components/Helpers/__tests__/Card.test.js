/** @module Card.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { CardTest, CardBack } from "../Card";

const TestedComponent = CardTest;

describe("renders without error", () => {
  test("card", () => {
    const wrapper = commonSetup(TestedComponent);
    const component = findByTestAttr(wrapper, "presentation-card");
    expect(component.length).toBe(1);
  });
  test("card back", () => {
    const wrapper = commonSetup(CardBack);
    const component = findByTestAttr(wrapper, "presentation-card-back");
    expect(component.length).toBe(1);
  });
});

/* test("top discard card displayed if there is one", () => {
  wrapper = commonSetup(TestedComponent, cardDrawnProps);
  discard = findByTestAttr(wrapper, "card-discard");
  empty = findByTestAttr(wrapper, "card-pile-discard-empty");
  expect(discard.length).toBe(1);
  expect(empty.length).toBe(0);
  expect(discard.props().src).toBe("/assets/cards/Test.png");
}); */
