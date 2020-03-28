/** @module cardLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
import * as data from "../../data/gridData";
import { aiPlayers } from "../../data/playerData";
import * as constant from "../../data/constants";
import { randAndArrangeRecommendations } from "../../utils/utilsCommon";
import * as helper from "./helperFunctions";
import actions from "../../redux/Actions";

/**
 * @function chooseCardToPlay
 * @description based on player hand and AI strategy, set play recommendations
 */
export const chooseCardToPlay = () => {
  const storeState = store.getState();
  const {
    playersState,
    gridState,
    cardsState,
    messageState: { stage }
  } = storeState;

  const playerDetails = _.get(
    playersState,
    `details.${playersState.players[playersState.turn]}`
  );
  const gridArray = Object.keys(gridState.grid).map(item => {
    return {
      ...gridState.grid[item],
      id: item
    };
  });
  // check for AI player
  if (stage < 2 && playerDetails.ai) {
    const aiPlayer =
      aiPlayers[
        _.get(playersState, `details.${playersState.activePlayer}.name`)
      ];
    const activePlayerHand = playerDetails.hand;
    // START recommendations (ai's only)
    if (activePlayerHand.length === 4) {
      const targetSpaces = [];
      activePlayerHand.forEach(card => {
        targetSpaces.push(...cardsState.cards[card].grid);
      });
      const evaluations = {};
      // evaluate each square
      targetSpaces.forEach(target => {
        let delta;
        const fullBuilding = gridArray.filter(
          square => square.buildingName === gridState.grid[target].buildingName
        );
        let fullOccupancy = 0;
        // stage 1
        if (stage === 0) {
          delta = gridState.grid[target].buildingCapacity; // + building capacity
          fullBuilding.forEach(room => {
            fullOccupancy += room.occupants.length;
          });
          delta -= fullOccupancy * (2 + aiPlayer.social); // - full building occupancy (x3)
          if (data.nextToVentSquares.includes(target)) {
            delta -= 0.5 * aiPlayer.cautious; // next to vent, reduce delta;
          }
          delta +=
            (5 - _.get(gridState, `grid.${target}.distanceToExit`)) * 0.5; // distance to exit; modified by strategy

          if (evaluations[target]) {
            evaluations[target].value += delta + 1; // if multiple copies of card, compound delta
          } else {
            evaluations[target] = {
              value: delta
            };
          }
        }
        // stage 2
        if (stage === 1) {
          delta =
            gridState.grid[target].buildingCapacity -
            gridState.grid[target].occupants.length; // + building capacity - building occupancy
          if (delta) {
            delta +=
              gridState.grid[target].occupants.length * (2 + aiPlayer.social); // + building occupancy
            const diversity = _.uniqBy(
              _.get(gridState, `grid.${target}.occupants`, []).map(
                occ => occ.player
              )
            ).length; // diversity
            if (diversity > 0) {
              delta += (diversity - 1) * 0.5 * aiPlayer.social;
            }
            if (data.nextToVentSquares.includes(target)) {
              delta -= 0.5 * aiPlayer.cautious; // next to vent, reduce delta;
            }
            delta +=
              (5 - _.get(gridState, `grid.${target}.distanceToExit`)) *
              0.5 *
              aiPlayer.cautious; // distance to exit; modified by strategy
          }
          if (evaluations[target]) {
            evaluations[target].value += delta + 1; // if multiple copies of card, compound delta
          } else {
            evaluations[target] = {
              value: delta
            };
          }
        }
      });
      const recommendations = Object.keys(evaluations).map(evals => {
        return {
          square: evals,
          value: evaluations[evals].value
        };
      });
      const updatedRecommendations = randAndArrangeRecommendations(
        recommendations
      );
      store.dispatch(actions.addRecommendations(updatedRecommendations));
      helper.AIDetermineCardToPlay();
    }
    // END recommendations (ai's only)
  }
};

/**
 * @function playPompCard
 * @description when player plays pompeii card
 * @param {String} card
 */
export const playPompCard = card => {
  console.log("playPompCard; card:", card);
  const storeState = store.getState();
  const { cardsState, flagsState, playersState } = storeState;

  let gridHighlights = cardsState.cards[card].grid.filter(val =>
    helper.vacancy(val)
  );

  if (!gridHighlights.length) {
    gridHighlights = _.uniqBy([
      ...data.gridByColor.White,
      ...data.gridByColor.Grey,
      ...data.gridByColor.Purple,
      ...data.gridByColor.Turquoise,
      ...data.gridByColor.Brown
    ]).filter(val => helper.vacancy(val));
    if (!flagsState.flags.includes("card-wild")) {
      store.dispatch(actions.toggleFlags("card-wild"));
    }
  }

  if (!flagsState.flags.includes("placing-person")) {
    store.dispatch(actions.toggleFlags("placing-person"));
  }

  store.dispatch(actions.setCardGrid(gridHighlights));
  store.dispatch(
    actions.updateInstructions({
      text: `${_.get(
        playersState,
        `details.${playersState.activePlayer}.name`
      )}: ${constant.PLACE}`,
      color: _.get(playersState, `details.${playersState.activePlayer}.color`)
    })
  );
};
