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
    playersState: state.playersState
  };
};

const mapDispatchToProps = {
  gameSetup: actions.gameSetup,
  drawCard: actions.drawCard
};

const MainContainer = props => {
  const { cardsState, playersState, gameSetup, drawCard } = props;

  useState(() => {
    if (!_.get(cardsState.cards)) {
      gameSetup();
    }
  }, []);

  return (
    <div data-test="container-main">
      <Main
        cardsState={cardsState}
        playersState={playersState}
        drawCard={drawCard}
      />
    </div>
  );
};

MainContainer.propTypes = {
  cardsState: types.cardsState.types,
  playersState: types.playersState.types,
  gameSetup: PropTypes.func,
  drawCard: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  playersState: types.playersState.defaults,
  gameSetup: () => {},
  drawCard: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
