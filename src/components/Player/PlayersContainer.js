/** @module PlayersContainer */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import * as types from "../../types/types";

import Player from "./Player";
import { chooseCardToPlay } from "../Logic/cardLogic";

const mapStateToProps = state => {
  return {
    playersState: state.playersState,
    gamePlayState: state.gamePlayState
  };
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
        numberOfPlayers={playersState.players.length}
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
  const { playersState, gamePlayState, playPompCard, stage } = props;

  useEffect(() => {
    if (
      _.get(
        playersState,
        `details.${playersState.activePlayer}.hand.length`
      ) === 4 &&
      _.get(gamePlayState, "recommendations.length") === 0
    ) {
      chooseCardToPlay();
    }
  }, [playersState, gamePlayState]);

  /**
   * @function playCard
   * @decription fires/dispatches functions as result of playing (selecting) a card from hand
   * @param {String} player
   * @param {Number} cardIdx
   */
  const playCard = (player, cardIdx) => {
    const thisHand = [...playersState.details[player].hand];
    const cardId = thisHand[cardIdx];
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
  gamePlayState: types.gamePlayState.types,
  stage: PropTypes.number,
  playPompCard: PropTypes.func
};

PlayersContainer.defaultProps = {
  playersState: types.playersState.defaults,
  gamePlayState: types.gamePlayState.defaults,
  stage: 0,
  playPompCard: () => {}
};

export const PlayersContainerTest = PlayersContainer;
export default connect(mapStateToProps)(PlayersContainer);
