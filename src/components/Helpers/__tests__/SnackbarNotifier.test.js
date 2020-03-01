/** @module SnackbarNotifier.test */

import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import configureStore from "redux-mock-store";

import { findByTestAttr } from "../../../utils/utilsTest";
import { SnackbarNotifierTest } from "../SnackbarNotifier";

const TestedComponent = SnackbarNotifierTest;

const defaultProps = {};

const mockStore = configureStore();

const setup = (props = {}) => {
  const setupProps = {
    ...defaultProps,
    ...props
  };
  const initialState = {};
  const store = mockStore(initialState);
  const wrapper = mount(
    <SnackbarProvider>
      <Provider store={store}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <TestedComponent store={store} {...setupProps} />
      </Provider>
    </SnackbarProvider>
  );
  return wrapper;
};

test("renders without error", () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, "common-snackbar-notifier");
  expect(component.length).toBe(1);
});

describe("enqueued snackbar", () => {
  const mockAddMessage = jest.fn();
  test("no message, no clearing of message", () => {
    const wrapper = setup({});
    wrapper.update();
    expect(mockAddMessage.mock.calls.length).toBe(0);
  });
  test("with message, clear message", () => {
    const wrapper = setup({
      snackbarState: {
        message: "Test Message",
        type: "info"
      },
      addSnackbar: mockAddMessage
    });
    wrapper.update();
    expect(mockAddMessage).toHaveBeenCalledWith({ message: null });
  });
});
