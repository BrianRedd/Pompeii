/** @module MainContainer */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../redux/Actions";
import * as types from "../types/types";
import * as constant from "../data/constants";
import { whiteGrid } from "../data/gridData";

import Main from "./Main";

const mapStateToProps = state => {
  return {
    cardsState: state.cardsState,
    gridState: state.gridState,
    messageState: state.messageState,
    playersState: state.playersState
  };
};

const mapDispatchToProps = {
  gameSetup: actions.gameSetup,
  takeCard: actions.takeCard,
  discardCard: actions.discardCard,
  incrementPlayerTurn: actions.incrementPlayerTurn,
  updatePlayerHand: actions.updatePlayerHand,
  updateInstructions: actions.updateInstructions,
  placePersonInSquare: actions.placePersonInSquare,
  incrementStage: actions.incrementStage
};

/**
 * @function MainContainer
 * @description Functional Container component for Main
 * @returns {React.Component} - Rendered component.
 */
const MainContainer = props => {
  const {
    cardsState,
    gridState,
    messageState,
    playersState,
    gameSetup,
    takeCard,
    discardCard,
    incrementPlayerTurn,
    updatePlayerHand,
    updateInstructions,
    placePersonInSquare,
    incrementStage
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

  const [cardGrid, setCardGrid] = useState([]);

  const [placingPerson, setPersonPlacing] = useState(false);

  const [relatives, setRelatives] = useState(false);

  /**
   * @function placePerson
   * @description function when person is placed
   * @param {String} grid
   */
  const placePerson = grid => {
    const currentOccupants = _.get(gridState, `grid.${grid}.occupants`, []);
    placePersonInSquare(grid, [
      ...currentOccupants,
      {
        player: activePlayer,
        gender: Math.round(Math.random()) ? "male" : "female"
      }
    ]);

    setPersonPlacing(false);
    updateInstructions({
      text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
        constant.DRAW
      }`,
      color: _.get(playersState, `details[${activePlayer}].color`)
    });
    if (messageState.stage === 1 && !relatives) {
      setRelatives(true);
      setCardGrid([...cardGrid, ...whiteGrid]);
    } else {
      setRelatives(false);
      setCardGrid([]);
    }
  };

  /**
   * @function playPompCard
   * @description when player plays pompeii card
   * @param {String} card
   */
  const playPompCard = card => {
    setCardGrid(cardsState.cards[card].grid);

    setPersonPlacing(true);
    updateInstructions({
      text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
        constant.PLACE
      }`,
      color: _.get(playersState, `details[${activePlayer}].color`)
    });
  };

  /**
   * @function resolveAd79
   * @description resolve AD 79 card when drawn
   */
  const resolveAd79 = () => {
    incrementStage();
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
    if (_.get(cardsState, `cards[${takenCard}].type`) === constant.AD79) {
      discardCard(takenCard);
      resolveAd79();
      return;
    }

    // check for Omen
    if (_.get(cardsState, `cards[${takenCard}].type`) === constant.OMEN) {
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
    incrementPlayerTurn();
  };

  return (
    <div data-test="container-main">
      <Main
        cardsState={cardsState}
        gridState={gridState}
        messageState={messageState}
        playersState={playersState}
        drawCard={drawCard}
        discardCard={discardCard}
        updatePlayerHand={updatePlayerHand}
        deckEnabled={
          _.get(playersState, `details[${activePlayer}].hand.length`) < 4 &&
          !placingPerson
        }
        playPompCard={playPompCard}
        cardGrid={cardGrid}
        placePerson={placePerson}
      />
    </div>
  );
};

MainContainer.propTypes = {
  cardsState: types.cardsState.types,
  gridState: types.gridState.types,
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  gameSetup: PropTypes.func,
  takeCard: PropTypes.func,
  discardCard: PropTypes.func,
  incrementPlayerTurn: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  updateInstructions: PropTypes.func,
  placePersonInSquare: PropTypes.func,
  incrementStage: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  gameSetup: () => {},
  takeCard: () => {},
  discardCard: () => {},
  incrementPlayerTurn: () => {},
  updatePlayerHand: () => {},
  updateInstructions: () => {},
  placePersonInSquare: () => {},
  incrementStage: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
