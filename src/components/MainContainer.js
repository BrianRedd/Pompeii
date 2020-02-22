/** @module MainContainer */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
  discardCard: actions.discardCard,
  nextPlayerTurn: actions.nextPlayerTurn,
  updatePlayerHand: actions.updatePlayerHand
};

/**
 * @function MainContainer
 * @description Functional Container component for Main
 * @returns {React.Component} - Rendered component.
 */
const MainContainer = props => {
  const {
    cardsState,
    playersState,
    gameSetup,
    takeCard,
    discardCard,
    nextPlayerTurn,
    updatePlayerHand
  } = props;

  const numberOfPlayers = 3;

  useState(() => {
    if (!_.get(cardsState.cards)) {
      gameSetup(numberOfPlayers);
    }
  }, []);

  const [activePlayer, setActivePlayer] = useState();

  useEffect(() => {
    setActivePlayer(_.get(playersState, `players[${playersState.turn}]`));
  }, [playersState]);

  /**
   * @function playPompCard
   * @description when player plays pompeii card
   * @param {String} player
   * @param {String} card
   */
  const playPompCard = (player, card) => {
    console.log(
      `${playersState.details[player].name} plays ${cardsState.cards[card].name}`
    );
  };

  /**
   * @function resolveAd79
   * @description resolve AD 79 card when drawn
   */
  const resolveAd79 = () => {
    alert("AD 79 Card");
  };

  /**
   * @function resolveOmen
   * @description resolve Omen card when drawn
   */
  const resolveOmen = () => {
    alert("Omen Card");
  };

  /**
   * @function drawCard
   * @description draw card from deck
   */
  const drawCard = () => {
    // draw card
    const takenCard = cardsState.deck[cardsState.deck.length - 1];
    takeCard();

    // check for AD79
    if (_.get(cardsState, `cards[${takenCard}].type`) === "AD79") {
      discardCard(takenCard);
      resolveAd79();
      return;
    }

    // check for Omen
    if (_.get(cardsState, `cards[${takenCard}].type`) === "OMEN") {
      discardCard(takenCard);
      resolveOmen();
      return;
    }

    const newHand = [
      ..._.get(playersState, `details[${activePlayer}].hand`),
      takenCard
    ];

    // add card to player hand
    updatePlayerHand(activePlayer, newHand);

    // next player's turn
    nextPlayerTurn();
  };

  return (
    <div data-test="container-main">
      <Main
        cardsState={cardsState}
        playersState={playersState}
        drawCard={drawCard}
        discardCard={discardCard}
        updatePlayerHand={updatePlayerHand}
        deckEnabled={
          _.get(playersState, `details[${activePlayer}].hand.length`) < 4
        }
        playPompCard={playPompCard}
      />
    </div>
  );
};

MainContainer.propTypes = {
  cardsState: types.cardsState.types,
  playersState: types.playersState.types,
  gameSetup: PropTypes.func,
  takeCard: PropTypes.func,
  discardCard: PropTypes.func,
  nextPlayerTurn: PropTypes.func,
  updatePlayerHand: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  playersState: types.playersState.defaults,
  gameSetup: () => {},
  takeCard: () => {},
  discardCard: () => {},
  nextPlayerTurn: () => {},
  updatePlayerHand: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
