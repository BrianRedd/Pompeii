/** @module GameOverModal.test */

import { findByTestAttr, commonSetup } from "../../../utils/utilsTest";
import TestedComponent from "../GameOverModal";

import * as types from "../../../types/types";

const defaultProps = {
  isOpen: true,
  statisticsOnly: true,
  playersState: {
    details: {
      player1: types.playerDetails.defaults.player1,
      player2: {
        ...types.playerDetails.defaults.player1,
        name: "Player 2"
      }
    }
  }
};

test("renders without error", () => {
  const wrapper = commonSetup(TestedComponent, defaultProps);
  const component = findByTestAttr(wrapper, "modal-game-over");
  expect(component.length).toBe(1);
});
