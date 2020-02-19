/** @module Card.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { CardTest } from "../Card";

const TestedComponent = CardTest;

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "presentation-card");
  expect(component.length).toBe(1);
});

/* test("top discard card displayed if there is one", () => {
  wrapper = commonSetup(TestedComponent, cardDrawnProps);
  discard = findByTestAttr(wrapper, "card-discard");
  empty = findByTestAttr(wrapper, "card-pile-discard-empty");
  expect(discard.length).toBe(1);
  expect(empty.length).toBe(0);
  expect(discard.props().src).toBe("/assets/cards/Test.png");
}); */
