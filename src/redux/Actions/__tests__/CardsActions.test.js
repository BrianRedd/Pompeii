/** @module CardsActions.test */

import * as actionTypes from "../../ActionTypes";
import * as actions from "../CardsActions";

test("addCards", () => {
  const payload = {
    TEST: {
      value: "test"
    }
  };
  const expectedAction = {
    type: actionTypes.ADD_CARDS,
    payload
  };
  expect(actions.addCards(payload)).toEqual(expectedAction);
});

test("addDeck", () => {
  const payload = ["test1", "test2"];
  const expectedAction = {
    type: actionTypes.ADD_DECK,
    payload
  };
  expect(actions.addDeck(payload)).toEqual(expectedAction);
});

test("shuffleCards", () => {
  const originalDeck = ["A", "B", "C", "D", "E"];
  expect(actions.shuffleCards(originalDeck)).not.toEqual(originalDeck);
});

test("generateDeck", async () => {
  // tested in StartupActions
});
