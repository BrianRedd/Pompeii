/** @module placeRelativesLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
import * as constant from "../../data/constants";
import { randAndArrangeRecommendations } from "../../utils/utilsCommon";
import actions from "../../redux/Actions";

// eslint-disable-next-line import/no-cycle
import { placePerson } from "./placePeopleLogic";

/**
 * @function placeRelatives
 * @description function when relatives is placed
 * @param {String} grid - grid where "parent" was placed
 */
export const placeRelatives = grid => {
  console.log("placeRelatives; grid:", grid);
  const storeState = store.getState();
  const {
    cardsState,
    flagsState,
    gamePlayState,
    gridState,
    playersState
    // gamePlayState: {
    //   gameSettings: { autoPlayDisabled }
    // },
  } = storeState;

  const playerDetails = _.get(
    playersState,
    `details.${playersState.activePlayer}`
  );
  // current other occupants
  const currentOccupants = _.get(gridState, `grid.${grid}.occupants`, []);
  let thisPlacedRelatives = gamePlayState.placedRelatives;
  let orderedRecommendations = [];

  if (grid) {
    // place relative in square
    const personObj = {
      id: `P${playersState.players.indexOf(playersState.activePlayer)}-${
        playersState.details[playersState.activePlayer].population.length
      }r`,
      player: playersState.activePlayer,
      gender: Math.round(Math.random()) ? "male" : "female"
    };
    store.dispatch(
      actions.placePeopleInSquare(grid, [...currentOccupants, personObj])
    );
    store.dispatch(
      actions.incrementPlayerPopulation(playersState.activePlayer, personObj)
    );
    thisPlacedRelatives = [...gamePlayState.placedRelatives, grid];
    store.dispatch(actions.setPlacedRelatives(thisPlacedRelatives));
    if (playerDetails.ai) {
      const idx = gamePlayState.recommendations
        .map(rec => rec.square)
        .indexOf(grid);
      gamePlayState.recommendations.splice(idx, 1);
      orderedRecommendations = randAndArrangeRecommendations(
        gamePlayState.recommendations
      );
      store.dispatch(actions.addRecommendations(orderedRecommendations));
    }
    store.dispatch(
      actions.setCardGrid([...cardsState.grid].filter(val => val !== grid))
    );
    store.dispatch(
      actions.addSnackbar({
        message: `${playerDetails.name} places a relative at ${
          grid.split("_")[1]
        } x ${grid.split("_")[0]}`,
        type: "success"
      })
    );
  }

  // if enough relatives have been placed, end relative placement
  if (thisPlacedRelatives.length === flagsState.relativesCount || !grid) {
    store.dispatch(actions.setRelativesCounter(0));
    store.dispatch(actions.setPlacedRelatives([]));
    store.dispatch(actions.addRecommendations([]));
    store.dispatch(actions.setCardGrid([]));
    if (flagsState.flags.includes("placing-person")) {
      store.dispatch(actions.toggleFlags("placing-person"));
    }
    store.dispatch(
      actions.updateInstructions({
        text: `${_.get(
          playersState,
          `details.${playersState.activePlayer}.name`
        )}: ${constant.DRAW}`,
        color: _.get(playersState, `details.${playersState.activePlayer}.color`)
      })
    );
  } else if (playerDetails.ai) {
    // AI: Place another relative
    setTimeout(() => {
      placePerson(orderedRecommendations[0].square);
    }, 500);
  }

  // if (!autoPlayDisabled) {
  //   console.log(`%c***AI (${playersState.activePlayer}) auto-draw NOW?`);
  // }
};
