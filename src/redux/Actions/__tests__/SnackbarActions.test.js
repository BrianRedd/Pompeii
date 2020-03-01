/** @module SnackbarActions.test */

import { ADD_SNACKBAR } from "../../ActionTypes";
import { addSnackbar } from "../SnackbarActions";

test("addSnackbar", () => {
  const payload = {
    message: "Snackbar Message",
    type: "default"
  };
  const expectedAction = {
    type: ADD_SNACKBAR,
    payload
  };
  expect(addSnackbar(payload)).toEqual(expectedAction);
});
