/** @module MainContainer */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";

import actions from "../redux/Actions";

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

  return <Main cardsState={cardsState} />;
};

MainContainer.propTypes = {
  cardsState: PropTypes.shape({
    cards: PropTypes.arrayOf(PropTypes.object),
    deck: PropTypes.arrayOf(PropTypes.object)
  }),
  generateDeck: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: {
    cards: [],
    deck: []
  },
  generateDeck: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
