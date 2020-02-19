/** cardsReducer.test */

import * as actionTypes from "../../ActionTypes";
import Reducer from "../cardsReducer";

const defaultState = {
  cards: {},
  deck: []
};

test("should return initial state", () => {
  expect(Reducer(undefined, { type: "", payload: "" })).toEqual(defaultState);
});

test("should handle ADD_CARDS action", () => {
  const payload = {
    CARD1: {
      value: "test"
    }
  };
  const action = {
    type: actionTypes.ADD_CARDS,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.cards).toEqual(payload);
});

test("should handle ADD_DECK action", () => {
  const payload = ["card1", "card2"];
  const action = {
    type: actionTypes.ADD_DECK,
    payload
  };
  const state = Reducer(undefined, action);
  expect(state.deck).toEqual(payload);
});
