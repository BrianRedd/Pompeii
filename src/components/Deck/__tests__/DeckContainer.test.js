/** @module DeckContainer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import { DeckContainerTest } from "../DeckContainer";

const TestedComponent = DeckContainerTest;

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "container-deck");
  expect(component.length).toBe(1);
});
