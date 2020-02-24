/** @module utilsCommon.test */

import { compareCards, shuffle } from "../utilsCommon";

test("compareCards", () => {
  const originalDeck = ["A_3", "B_2", "C_1"];
  expect(originalDeck.sort(compareCards)).toStrictEqual(["C_1", "B_2", "A_3"]);
});

test("shuffle", () => {
  const originalDeck = ["A", "B", "C", "D", "E"];
  expect(shuffle(originalDeck)).not.toEqual(originalDeck);
});
