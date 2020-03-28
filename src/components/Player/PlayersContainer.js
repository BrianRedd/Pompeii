/** @module PlayersContainer */

import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../../redux/Actions";
import * as types from "../../types/types";
// import * as data from "../../data/gridData";
// import { aiPlayers } from "../../data/playerData";

import Player from "./Player";
// import { randAndArrangeRecommendations } from "../../utils/utilsCommon";
import { chooseCardToPlay } from "../Logic/cardLogic";

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
  updatePlayerHand: actions.updatePlayerHand,
  addRecommendations: actions.addRecommendations
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
    // cardsState,
    // flagsState,
    // gridState,
    playersState,
    discardCard,
    // setRecommendationArray,
    // activePlayer,
    updatePlayerHand,
    playPompCard,
    stage,
    addRecommendations
  } = props;

  useEffect(() => {
    console.log("PlayerContainer useEffect");
    if (
      _.get(playersState, `details.${playersState.activePlayer}.hand.length`) >
      0
    ) {
      console.log(
        "activePlayer hand length",
        _.get(playersState, `details.${playersState.activePlayer}.hand.length`)
      );
      chooseCardToPlay(addRecommendations);
    }
    // const playerDetails = _.get(
    //   playersState,
    //   `details.${playersState.players[playersState.turn]}`
    // );
    // const gridArray = Object.keys(gridState.grid).map(item => {
    //   return {
    //     ...gridState.grid[item],
    //     id: item
    //   };
    // });
    // if (stage < 2 && playerDetails.ai) {
    //   // recommendations (ai's only)
    //   const aiPlayer =
    //     aiPlayers[_.get(playersState, `details.${activePlayer}.name`)];
    //   const activePlayerHand = playerDetails.hand;
    //   if (activePlayerHand.length === 4) {
    //     const targetSpaces = [];
    //     activePlayerHand.forEach(card => {
    //       targetSpaces.push(...cardsState.cards[card].grid);
    //     });
    //     const evaluations = {};
    //     // evaluate each square
    //     targetSpaces.forEach(target => {
    //       // const coord = target.split("_");
    //       let delta;
    //       const fullBuilding = gridArray.filter(
    //         square =>
    //           square.buildingName === gridState.grid[target].buildingName
    //       );
    //       let fullOccupancy = 0;
    //       // stage 1
    //       if (stage === 0) {
    //         delta = gridState.grid[target].buildingCapacity; // + building capacity
    //         fullBuilding.forEach(room => {
    //           fullOccupancy += room.occupants.length;
    //         });
    //         delta -= fullOccupancy * (2 + aiPlayer.social); // - full building occupancy (x3)
    //         if (data.nextToVentSquares.includes(target)) {
    //           delta -= 0.5 * aiPlayer.cautious; // next to vent, reduce delta;
    //         }
    //         delta +=
    //           (5 - _.get(gridState, `grid.${target}.distanceToExit`)) * 0.5; // distance to exit; modified by strategy

    //         if (evaluations[target]) {
    //           evaluations[target].value += delta + 1; // if multiple copies of card, compound delta
    //         } else {
    //           evaluations[target] = {
    //             value: delta
    //           };
    //         }
    //       }
    //       // stage 2
    //       if (stage === 1) {
    //         delta =
    //           gridState.grid[target].buildingCapacity -
    //           gridState.grid[target].occupants.length; // + building capacity - building occupancy
    //         if (delta) {
    //           delta +=
    //             gridState.grid[target].occupants.length * (2 + aiPlayer.social); // + building occupancy
    //           const diversity = _.uniqBy(
    //             _.get(gridState, `grid.${target}.occupants`, []).map(
    //               occ => occ.player
    //             )
    //           ).length; // diversity
    //           if (diversity > 0) {
    //             delta += (diversity - 1) * 0.5 * aiPlayer.social;
    //           }
    //           if (data.nextToVentSquares.includes(target)) {
    //             delta -= 0.5 * aiPlayer.cautious; // next to vent, reduce delta;
    //           }
    //           delta +=
    //             (5 - _.get(gridState, `grid.${target}.distanceToExit`)) *
    //             0.5 *
    //             aiPlayer.cautious; // distance to exit; modified by strategy
    //         }
    //         if (evaluations[target]) {
    //           evaluations[target].value += delta + 1; // if multiple copies of card, compound delta
    //         } else {
    //           evaluations[target] = {
    //             value: delta
    //           };
    //         }
    //       }
    //     });
    //     const recommendations = Object.keys(evaluations).map(evals => {
    //       return {
    //         square: evals,
    //         value: evaluations[evals].value
    //       };
    //     });
    //     setRecommendationArray(randAndArrangeRecommendations(recommendations));
    //   }
    // }
  }, [
    playersState,
    addRecommendations
    // stage,
    // activePlayer
    // cardsState,
    // setRecommendationArray,
    // gridState,
    // flagsState.relativesCounter,
    // activePlayer
  ]);

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
  // cardsState: types.cardsState.types,
  // flagsState: types.flagsState.types,
  // gridState: types.gridState.types,
  playersState: types.playersState.types,
  // activePlayer: PropTypes.string,
  stage: PropTypes.number,
  discardCard: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  // setRecommendationArray: PropTypes.func,
  playPompCard: PropTypes.func,
  addRecommendations: PropTypes.func
};

PlayersContainer.defaultProps = {
  // cardsState: types.cardsState.defaults,
  // flagsState: types.flagsState.defaults,
  // gridState: types.gridState.defaults,
  playersState: types.playersState.defaults,
  // activePlayer: "",
  stage: 0,
  discardCard: () => {},
  updatePlayerHand: () => {},
  // setRecommendationArray: () => {}
  playPompCard: () => {},
  addRecommendations: () => {}
};

export const PlayersContainerTest = PlayersContainer;
export default connect(mapStateToProps, mapDispatchToProps)(PlayersContainer);
