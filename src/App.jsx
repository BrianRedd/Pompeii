/* istanbul ignore file */
/** @module App */

import React from "react";
import { Provider } from "react-redux";

import "./styles/App.scss";

import MainContainer from "./components/MainContainer";

import store from "./redux/configureStore";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MainContainer />
      </div>
    </Provider>
  );
}

export default App;
