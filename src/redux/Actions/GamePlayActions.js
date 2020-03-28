/** @module GamePlayActions */

import _ from "lodash";

import { ADD_RECOMMENDATIONS } from "../ActionTypes";
import { generateDeck } from "./CardsActions";
import { addGrid } from "./GridActions";
import { updateInstructions, setStageInStore } from "./MessageActions";
import {
  setPlayerArray,
  addPlayers,
  setPlayerTurn,
  addActivePlayer
} from "./PlayersActions";
import { generatePile } from "./TilesActions";
import { playerColors } from "../../data/playerData";
import { gridSquares } from "../../data/gridData";
import * as constant from "../../data/constants";

/**
 * @function addRecommendationsToStore
 * @description adds initial grid to GamePlayState store
 * @param {Array} recommendations - array or recommendations
 */
export const addRecommendationsToStore = recommendations => ({
  type: ADD_RECOMMENDATIONS,
  payload: recommendations
});

/**
 * @function addRecommendations
 * @description dispatches initial grid to addRecommendationsToStore
 * @param {Array} recommendations - array or recommendations
 */
export const addRecommendations = recommendations => dispatch => {
  console.log("GamePlayActions > addRecommendations:", recommendations);
  dispatch(addRecommendationsToStore(recommendations));
};

/**
 * @function gameSetup
 * @description takes start game values and dispatches initial game store values
 * @param {Object} details playerState details object
 * @param {Number} startPlayer which player starts
 * @param {Object} testMode testMode object
 */
export const gameSetup = (
  details,
  startPlayer,
  testMode = {}
) => async dispatch => {
  const theseDetails = { ...details };

  const playersArray = Object.keys(theseDetails);

  if (testMode.active) {
    // START PRE-POPULATION (TEST)
    const gridKeys = Object.keys(gridSquares);
    gridKeys.forEach(grid => {
      const potentialPop = _.get(gridSquares, `${grid}.buildingCapacity`, 0);
      const actualPop = Math.round(Math.random() * potentialPop);
      const occupants = [];
      for (let i = 0; i < actualPop; i += 1) {
        const player =
          playersArray[Math.floor(Math.random() * playersArray.length)];
        occupants.push({
          player,
          gender: Math.floor(Math.random() * 2) === 1 ? "male" : "female"
        });
        theseDetails[player].population += 1;
      }
      gridSquares[grid].occupants = occupants;
    });
    // END PRE-POPULATION (TEST)
  }

  if (testMode.stage > 0) {
    await dispatch(setStageInStore(testMode.stage));
  }
  await dispatch(addGrid(gridSquares));
  await dispatch(setPlayerArray(playersArray));
  await dispatch(addPlayers(theseDetails));
  await dispatch(setPlayerTurn(parseFloat(startPlayer) - 1));
  await dispatch(addActivePlayer(playersArray[startPlayer]));
  await dispatch(generateDeck());
  await dispatch(generatePile());
  await dispatch(
    updateInstructions({
      text: `${details[`player${startPlayer}`].name}: ${constant.PLAY}`,
      color: playerColors[parseFloat(startPlayer) - 1]
    })
  );
};
