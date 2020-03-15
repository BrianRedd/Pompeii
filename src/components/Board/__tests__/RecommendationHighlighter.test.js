/** @module RecommendationHighlighter.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../RecommendationHighlighter";

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent);
  const component = findByTestAttr(wrapper, "overlay-highlight-recommendation");
  expect(component.length).toBe(1);
});
