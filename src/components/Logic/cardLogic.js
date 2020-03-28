/** @module cardLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
// import { addRecommendations } from "../../redux/Actions/GamePlayActions";
// import actions from "../../redux/Actions";
import * as data from "../../data/gridData";
import { aiPlayers } from "../../data/playerData";
import { randAndArrangeRecommendations } from "../../utils/utilsCommon";

export const chooseCardToPlay = addRecommendations => {
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
  console.log("playersState.activePlayer:", playersState.activePlayer);
  console.log("stage:", stage);
  console.log("playerDetails:", playerDetails);
  const gridArray = Object.keys(gridState.grid).map(item => {
    return {
      ...gridState.grid[item],
      id: item
    };
  });
  if (stage < 2 && playerDetails.ai) {
    // recommendations (ai's only)
    const aiPlayer =
      aiPlayers[
        _.get(playersState, `details.${playersState.activePlayer}.name`)
      ];
    console.log("aiPlayer:", aiPlayer);
    const activePlayerHand = playerDetails.hand;
    console.log("activePlayerHand:", activePlayerHand);
    if (activePlayerHand.length === 4) {
      const targetSpaces = [];
      activePlayerHand.forEach(card => {
        targetSpaces.push(...cardsState.cards[card].grid);
      });
      const evaluations = {};
      // evaluate each square
      targetSpaces.forEach(target => {
        // const coord = target.split("_");
        let delta;
        const fullBuilding = gridArray.filter(
          square => square.buildingName === gridState.grid[target].buildingName
        );
        let fullOccupancy = 0;
        // stage 1
        console.log("stage 1");
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
        console.log("stage 2");
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
      console.log("cardLogic > addRecommendations:", recommendations);
      console.log(
        "cardLogic > updatedRecommendations:",
        updatedRecommendations
      );
      console.log("addRecommendations:", addRecommendations);
      addRecommendations(updatedRecommendations);
    }
  }
};
