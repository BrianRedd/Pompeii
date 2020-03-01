/** @module PlayersContainer */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../../redux/Actions";
import * as types from "../../types/types";

import Player from "./Player";

const mapStateToProps = state => {
  return {
    flagsState: state.flagsState,
    playersState: state.playersState
  };
};

const mapDispatchToProps = {
  discardCard: actions.discardCard,
  updatePlayerHand: actions.updatePlayerHand
};

/**
 * @function PlayerCards
 * @description List components for player cards
 * @param {Object} props.playersState
 * @returns {React.Component}
 */
const PlayerCards = ({ playersState, playCard, stage }) => {
  const playerCards = playersState.players.map((player, idx) => {
    return (
      <Player
        key={player}
        details={playersState.details[player]}
        myTurn={playersState.turn === idx}
        playCard={cardIdx => playCard(player, cardIdx)}
        stage={stage}
      />
    );
  });
  return playerCards;
};

/**
 * @function PlayersContainer
 * @description Functional Container component for Players
 * @returns {React.Component} - Rendered component.
 */
const PlayersContainer = props => {
  const {
    playersState,
    discardCard,
    updatePlayerHand,
    playPompCard,
    stage
  } = props;

  /**
   * @function playCard
   * @decription fires/dispatches functions as result of playing (selecting) a card from hand
   * @param {String} player
   * @param {Number} cardIdx
   */
  const playCard = (player, cardIdx) => {
    const thisHand = [...playersState.details[player].hand];
    const cardId = thisHand[cardIdx];
    thisHand.splice(cardIdx, 1);
    discardCard(cardId);
    updatePlayerHand(player, thisHand);
    playPompCard(cardId);
  };

  return (
    <div data-test="container-players" className="players-container">
      {!_.isEmpty(playersState.details) && (
        <PlayerCards
          playersState={playersState}
          playCard={playCard}
          stage={stage}
        />
      )}
    </div>
  );
};

PlayersContainer.propTypes = {
  playersState: types.playersState.types,
  stage: PropTypes.number,
  discardCard: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  playPompCard: PropTypes.func
};

PlayersContainer.defaultProps = {
  playersState: types.playersState.defaults,
  stage: 0,
  discardCard: () => {},
  updatePlayerHand: () => {},
  playPompCard: () => {}
};

export const PlayersContainerTest = PlayersContainer;
export default connect(mapStateToProps, mapDispatchToProps)(PlayersContainer);
