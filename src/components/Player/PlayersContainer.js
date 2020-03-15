/** @module PlayersContainer */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../../redux/Actions";
import * as types from "../../types/types";

import Player from "./Player";

const mapStateToProps = state => {
  return {
    cardsState: state.cardsState,
    flagsState: state.flagsState,
    gridState: state.gridState,
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
  const {
    cardsState,
    gridState,
    playersState,
    discardCard,
    updatePlayerHand,
    playPompCard,
    stage,
    setRecommendationArray
  } = props;

  useEffect(() => {
    // recommendations
    if (stage < 2) {
      const activePlayerHand = _.get(
        playersState,
        `details.${playersState.players[playersState.turn]}.hand`
      );
      if (activePlayerHand.length === 4) {
        const targetSpaces = [];
        activePlayerHand.forEach(card => {
          targetSpaces.push(...cardsState.cards[card].grid);
        });
        const evaluations = {};
        // evaluate each square
        targetSpaces.forEach(target => {
          if (stage === 0) {
            // TODO: Additional criteria:
            // * if card is better placed in next phase
            // * square proximity to vents

            let delta = gridState.grid[target].buildingCapacity; // + building capacity
            delta -= gridState.grid[target].occupants.length * 2; // - building occupancy (x2)
            if (evaluations[target]) {
              evaluations[target].value += delta + 1; // if multiple copies of card, compound delta
            } else {
              evaluations[target] = {
                value: delta
              };
            }
          }
          if (stage === 1) {
            let delta =
              gridState.grid[target].buildingCapacity -
              gridState.grid[target].occupants.length; // + building capacity - building occupancy
            if (delta) {
              delta += gridState.grid[target].occupants.length * 3; // + building occupancy (x3) (if building has capacity)
            }
            if (evaluations[target]) {
              evaluations[target].value += delta + 1; // if multiple copies of card, compound delta
            } else {
              evaluations[target] = {
                value: delta
              };
            }
          }
          // TODO: Placement of Relatives
          // * placement to plan ahead for cards in hand
        });
        const recommendationArray = Object.keys(evaluations).map(evals => {
          return {
            space: evals,
            value: evaluations[evals].value
          };
        });
        setRecommendationArray(recommendationArray);
      }
    }
  }, [playersState, stage, cardsState, setRecommendationArray, gridState]);

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
  cardsState: types.cardsState.types,
  gridState: types.gridState.types,
  playersState: types.playersState.types,
  stage: PropTypes.number,
  discardCard: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  playPompCard: PropTypes.func,
  setRecommendationArray: PropTypes.func
};

PlayersContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  gridState: types.gridState.defaults,
  playersState: types.playersState.defaults,
  stage: 0,
  discardCard: () => {},
  updatePlayerHand: () => {},
  playPompCard: () => {},
  setRecommendationArray: () => {}
};

export const PlayersContainerTest = PlayersContainer;
export default connect(mapStateToProps, mapDispatchToProps)(PlayersContainer);
