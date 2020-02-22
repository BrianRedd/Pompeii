/** @module PlayersContainer */

import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import * as types from "../../types/types";

import Player from "./Player";

/**
 * @function PlayerCards
 * @description List components for player cards
 * @param {Object} props.playersState
 * @returns {React.Component}
 */
const PlayerCards = ({ playersState, playCard }) => {
  const playerCards = playersState.players.map((player, idx) => {
    return (
      <Player
        key={player}
        details={playersState.details[player]}
        myTurn={playersState.turn === idx}
        playCard={cardIdx => playCard(player, cardIdx)}
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
  const { playersState, discardCard, updatePlayerHand, playPompCard } = props;

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
    playPompCard(player, cardId);
  };

  return (
    <div data-test="container-players" className="players-container">
      {!_.isEmpty(playersState.details) && (
        <PlayerCards playersState={playersState} playCard={playCard} />
      )}
    </div>
  );
};

PlayersContainer.propTypes = {
  playersState: types.playersState.types,
  discardCard: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  playPompCard: PropTypes.func
};

PlayersContainer.defaultProps = {
  playersState: types.playersState.defaults,
  discardCard: () => {},
  updatePlayerHand: () => {},
  playPompCard: () => {}
};

export default PlayersContainer;
