/** @module PlayersContainer.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../PlayersContainer";

const defaultProps = {
  playersState: {
    players: ["player1", "player2"],
    details: { player1: { name: "Test 1" }, player2: { name: "Test 2" } }
  }
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "container-players");
  expect(component.length).toBe(1);
});
