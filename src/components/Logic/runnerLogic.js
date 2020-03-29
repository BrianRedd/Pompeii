/** @module runnerLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
import actions from "../../redux/Actions";

import * as constant from "../../data/constants";
import * as utils from "../../utils/utilsCommon";
import * as helper from "./helperFunctions";

/**
 * @function runForYourLives
 * @description player can now run two of their people
 */
export const runForYourLives = async () => {
  console.log("runForYourLives");
  const storeState = store.getState();
  const { playersState } = storeState;

  const playerDetails = _.get(
    playersState,
    `details.${playersState.activePlayer}`
  );
  store.dispatch(
    actions.updateInstructions({
      text: `${playerDetails.name}: ${constant.RUN}`,
      color: playerDetails.color
    })
  );
  if (playerDetails.ai) {
    const sortedRecommendations = utils.randAndArrangeRecommendations(
      helper.runnerRecommendations()
    );
    store.dispatch(actions.addRecommendations(sortedRecommendations));
    console.log("I'm an AI; I choose:", sortedRecommendations[0]);
  }
};

/**
 * @function selectRunner
 * @description select person to run
 * @param {Object} person - person object
 * @param {String} square - square
 */
export const selectRunner = (person, square) => {
  console.log("selectRunner; person:", person, "square:", square);
  const storeState = store.getState();
  const { gridState, playersState } = storeState;

  const playerDetails = _.get(
    playersState,
    `details.${playersState.activePlayer}`
  );
  store.dispatch(actions.setRunner(person));

  store.dispatch(actions.setRunFromSquare(square));
  if (person.player !== playersState.activePlayer) {
    store.dispatch(
      actions.addSnackbar({
        message: "Not your person!",
        type: "warning"
      })
    );
    return;
  }
  if (
    person.lastMoved === playersState.totalTurns &&
    playerDetails.population !== 1
  ) {
    store.dispatch(
      actions.addSnackbar({
        message: "Already ran this person this turn!",
        type: "warning"
      })
    );
    return;
  }

  const pop = _.get(gridState, `grid.${square}.occupants.length`);

  const targetZones = helper.calculateRunZones(square, pop + 1);

  store.dispatch(actions.setRunZone(targetZones));
  if (playerDetails.ai) {
    const sortedRecommendations = utils.randAndArrangeRecommendations(
      helper.runToRecommendations(targetZones, square)
    );
    store.dispatch(actions.addRecommendations(sortedRecommendations));
  }
};
