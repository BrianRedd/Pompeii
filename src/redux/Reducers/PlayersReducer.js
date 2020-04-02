/** @module PlayersReducer */

import _ from "lodash";

import * as actions from "../ActionTypes";
import * as types from "../../types/types";
import { compareCards } from "../../utils/utilsCommon";

/**
 * @constant playersState
 * @param {Object} state - players state object
 * @param {Object} action
 */
const playersState = (state = types.playersState.defaults, action) => {
  const { type, payload } = action;
  let totalTurns;
  let populationArray = [];
  let casualtiesArray = [];
  let savedArray = [];
  let idx;
  switch (type) {
    case actions.SET_PLAYERS_ARRAY:
      return {
        ...state,
        players: payload
      };
    case actions.ADD_PLAYERS:
      return {
        ...state,
        details: payload
      };
    case actions.ADD_PLAYER:
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: payload.details
        }
      };
    case actions.UPDATE_PLAYER_HAND:
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            hand: payload.hand.sort(compareCards)
          }
        }
      };
    case actions.INCREMENT_PLAYER_POPULATION:
      populationArray = _.get(
        state,
        `details.${payload.playerId}.population`,
        []
      );
      populationArray.push(payload.personObj);
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            population: populationArray
          }
        }
      };
    case actions.INCREMENT_PLAYER_CASUALTIES:
      populationArray = _.get(
        state,
        `details.${payload.playerId}.population`,
        []
      );
      idx = populationArray.map(pop => pop.id).indexOf(payload.personObj.id);
      populationArray.slice(idx, 1);
      casualtiesArray = _.get(
        state,
        `details.${payload.playerId}.casualties`,
        []
      );
      casualtiesArray.push(payload.personObj);
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            population: populationArray,
            casualties: casualtiesArray
          }
        }
      };
    case actions.INCREMENT_PLAYER_SAVED:
      console.log(
        "INCREMENT_PLAYER_SAVED; payload:",
        payload.playerId,
        payload.personObj
      );
      populationArray = _.get(
        state,
        `details.${payload.playerId}.population`,
        []
      );
      console.log(_.get(state, `details.${payload.playerId}.population`, []));
      idx = populationArray.map(pop => pop.id).indexOf(payload.personObj.id);
      console.log("idx:", idx);
      populationArray.slice(idx, 1);
      savedArray = _.get(state, `details.${payload.playerId}.saved`, []);
      savedArray.push(payload.personObj);
      console.log("populationArray:", populationArray);
      return {
        ...state,
        details: {
          ...state.details,
          [payload.playerId]: {
            ...state.details[payload.playerId],
            saved: savedArray,
            population: populationArray
          }
        }
      };
    case actions.SET_PLAYER_TURN:
      totalTurns = state.totalTurns + 1;
      return {
        ...state,
        turn: payload,
        totalTurns
      };
    case actions.SET_ACTIVE_PLAYER:
      return {
        ...state,
        activePlayer: payload
      };
    default:
      return state;
  }
};

export default playersState;
