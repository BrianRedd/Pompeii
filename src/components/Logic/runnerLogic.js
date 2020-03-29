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
  }
};
