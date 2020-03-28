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

test("takeCard", () => {
  const expectedAction = {
    type: actionTypes.TAKE_CARD,
    payload: null
  };
  expect(actions.takeCard()).toEqual(expectedAction);
});

test("generateDeck", async () => {
  // tested in GamePlayActions
});
