/** @module GamePlayActions */

import _ from "lodash";

import * as actionTypes from "../ActionTypes";
import { generateDeck } from "./CardsActions";
import { setEruptionCounter } from "./FlagsActions";
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
  type: actionTypes.ADD_RECOMMENDATIONS,
  payload: recommendations
});

/**
 * @function addRecommendations
 * @description dispatches initial grid to addRecommendationsToStore
 * @param {Array} recommendations - array or recommendations
 */
export const addRecommendations = recommendations => dispatch => {
  dispatch(addRecommendationsToStore(recommendations));
};

/**
 * @function setPlacedRelativesToStore
 * @description sets relatives array
 * @param {Array} relatives - array or relatives
 */
export const setPlacedRelativesToStore = relatives => ({
  type: actionTypes.SET_PLACED_RELATIVES,
  payload: relatives
});

/**
 * @function setPlacedRelatives
 * @description dispatches initial grid to setPlacedRelativesToStore
 * @param {Array} relatives - array or relatives
 */
export const setPlacedRelatives = relatives => dispatch => {
  dispatch(setPlacedRelativesToStore(relatives));
};

/**
 * @function saveGameSettings
 * @description saves dev-level game settings
 * @param {Object} settings
 */
export const saveGameSettings = relatives => ({
  type: actionTypes.SAVE_GAME_SETTINGS,
  payload: relatives
});

/**
 * @function gameSetup
 * @description takes start game values and dispatches initial game store values
 * @param {Object} details playerState details object
 * @param {Number} startPlayer which player starts
 * @param {Object} gameSettings gameSettings object
 */
export const gameSetup = (
  details,
  startPlayer,
  gameSettings = {}
) => async dispatch => {
  const theseDetails = { ...details };

  const playersArray = Object.keys(theseDetails);

  if (gameSettings.prePopulate) {
    // START PRE-POPULATION (TEST)
    const gridKeys = Object.keys(gridSquares);
    gridKeys.forEach(grid => {
      const potentialPop = _.get(gridSquares, `${grid}.buildingCapacity`, 0);
      const actualPop = Math.round(Math.random() * potentialPop);
      const occupants = [];
      for (let i = 0; i < actualPop; i += 1) {
        const player =
          playersArray[Math.floor(Math.random() * playersArray.length)];
        const personObj = {
          id: `P${i}-${theseDetails[player].population.length}`,
          player,
          gender: Math.floor(Math.random() * 2) === 1 ? "male" : "female"
        };
        occupants.push(personObj);
        theseDetails[player].population.push(personObj); // TODO
        console.log("theseDetails:", theseDetails);
      }
      gridSquares[grid].occupants = occupants;
    });
    // END PRE-POPULATION (TEST)
  }

  if (gameSettings.startPhase > 0) {
    await dispatch(setStageInStore(gameSettings.startPhase));
  }
  await dispatch(saveGameSettings(gameSettings));
  await dispatch(addGrid(gridSquares));
  await dispatch(setEruptionCounter(gameSettings.noEruption ? 0 : 6));
  await dispatch(setPlayerArray(playersArray));
  await dispatch(addPlayers(theseDetails));
  await dispatch(setPlayerTurn(parseFloat(startPlayer) - 1));
  await dispatch(addActivePlayer(playersArray[startPlayer]));
  await dispatch(generateDeck(!!(gameSettings.stage > 0)));
  await dispatch(generatePile(gameSettings.wildLava));
  await dispatch(
    updateInstructions({
      text: `${details[`player${startPlayer}`].name}: ${constant.PLAY}`,
      color: playerColors[parseFloat(startPlayer) - 1]
    })
  );
};
