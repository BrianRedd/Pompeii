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
  takeCard: actions.takeCard,
  discardCard: actions.discardCard
};

/**
 * @function MainContainer
 * @description Functional Container component for Main
 * @returns {React.Component} - Rendered component.
 */
const MainContainer = props => {
  const { cardsState, playersState, gameSetup, takeCard, discardCard } = props;

  useState(() => {
    if (!_.get(cardsState.cards)) {
      gameSetup();
    }
  }, []);

  /**
   * @function drawCard
   * @description draw card from deck
   */
  const drawCard = () => {
    const takenCard = cardsState.deck[cardsState.deck.length - 1];
    takeCard();
    discardCard(takenCard);
  };

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
  takeCard: PropTypes.func,
  discardCard: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  playersState: types.playersState.defaults,
  gameSetup: () => {},
  takeCard: () => {},
  discardCard: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
