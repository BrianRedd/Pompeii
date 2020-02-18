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
    cardsState: state.cardsState,
    playersState: state.playerState
  };
};

const mapDispatchToProps = {
  gameSetup: actions.gameSetup
};

const MainContainer = props => {
  const { cardsState, gameSetup } = props;

  useState(() => {
    if (!_.get(cardsState.cards)) {
      gameSetup();
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
  gameSetup: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  gameSetup: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
