/** @module MainContainer */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";

import actions from "../redux/Actions";
import * as types from "../types/types";

import Main from "./Main";

const mapStateToProps = state => {
  return {
    cardsState: state.cardsState
  };
};

const mapDispatchToProps = {
  generateDeck: actions.generateDeck
};

const MainContainer = props => {
  const { cardsState, generateDeck } = props;

  useState(() => {
    if (!_.get(cardsState.cards)) {
      generateDeck();
    }
  }, []);

  return (
    <div data-test="container-main">
      <Main cardsState={cardsState} />
    </div>
  );
};

MainContainer.propTypes = {
  cardsState: types.cardsState.types,
  generateDeck: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  generateDeck: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
