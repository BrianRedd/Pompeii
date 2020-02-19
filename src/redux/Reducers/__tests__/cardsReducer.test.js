/** CardsReducer.test */

import * as actionTypes from "../../ActionTypes";
import Reducer from "../CardsReducer";

const defaultState = {
  cards: {},
  deck: [],
  discard: []
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

test("should handle TAKE_CARD action", () => {
  const action = {
    type: actionTypes.TAKE_CARD,
    payload: null
  };
  const state = Reducer({ deck: ["card1", "card2"], discard: [] }, action);
  expect(state.deck).toEqual(["card1"]);
});

test("should handle DISCARD_CARD action", () => {
  const payload = "card2";
  const action = {
    type: actionTypes.DISCARD_CARD,
    payload
  };
  const state = Reducer(
    { deck: ["card1", "card2"], discard: ["card3"] },
    action
  );
  expect(state.discard).toEqual(["card3", "card2"]);
});
