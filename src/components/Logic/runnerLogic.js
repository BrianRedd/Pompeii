/** @module runnerLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
import actions from "../../redux/Actions";

import * as constant from "../../data/constants";
import * as utils from "../../utils/utilsCommon";
import * as helper from "./helperFunctions";
import { escapeSquares } from "../../data/gridData";

/**
 * @function runToSquare
 * @description handle person running from one square to another
 * @param {String} toSquare
 */
export const runToSquare = toSquare => {
  const storeState = store.getState();
  const { flagsState, gamePlayState, gridState, playersState } = storeState;

  store.dispatch(actions.addRecommendations([]));
  const playerDetails = _.get(
    playersState,
    `details.${playersState.activePlayer}`
  );
  console.log("runToSquare; toSquare:", toSquare);
  if (toSquare === gridState.runFromSquare) {
    store.dispatch(actions.selectPerson(null));
    store.dispatch(actions.setRunZone([]));
    return;
  }
  let numberOfRuns = toSquare ? flagsState.runCount : 0;

  if (numberOfRuns) {
    const oldSquareOccupants = _.get(
      gridState,
      `grid.${gridState.runFromSquare}.occupants`
    );
    const oldSquareIdx = oldSquareOccupants
      .map(occupant => occupant.id)
      .indexOf(gamePlayState.selectedPerson.id);
    oldSquareOccupants.splice(oldSquareIdx, 1);
    store.dispatch(
      actions.placePeopleInSquare(gridState.runFromSquare, oldSquareOccupants)
    );

    if (escapeSquares.includes(toSquare)) {
      store.dispatch(
        actions.incrementPlayerSaved(gamePlayState.selectedPerson)
      );
      if (playerDetails.population.length === 1) {
        numberOfRuns = 1;
      }
    } else {
      const newSquareOccupants = _.get(gridState, `grid.${toSquare}.occupants`);
      newSquareOccupants.push({
        ...gamePlayState.selectedPerson,
        lastMoved:
          oldSquareOccupants.length > 0 ? playersState.totalTurns : undefined
      });
    }

    numberOfRuns -= 1;
  }
  if (playerDetails.population.length < 1) {
    numberOfRuns = 0;
  }
  store.dispatch(actions.setRunCounter(numberOfRuns));
  store.dispatch(actions.setRunZone([]));
  store.dispatch(actions.setRunner());
  store.dispatch(actions.selectPerson(null));
  if (!numberOfRuns) {
    console.log(
      `%c***If ${playersState.activePlayer} is AI, should they auto-draw now?`,
      "color: red; font-weight: bold;"
    );
    store.dispatch(actions.incrementPlayerTurn());
  } else if (playerDetails.ai) {
    setTimeout(() => {
      store.dispatch(
        actions.addRecommendations(
          utils.randAndArrangeRecommendations(helper.runnerRecommendations())
        )
      );
      const sortedRecommendations = utils.randAndArrangeRecommendations(
        helper.runnerRecommendations()
      );
      const selectedSquare = sortedRecommendations[0].square;
      const census = _.get(gridState, `grid.${selectedSquare}.occupants`);
      let selectedOccupant = "";
      census.forEach(occupant => {
        if (occupant.player === playersState.activePlayer) {
          selectedOccupant = occupant;
        }
      });
      // eslint-disable-next-line no-use-before-define
      selectRunner(selectedOccupant, selectedSquare);
    }, 100);
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

  const personPlusSquare = {
    ...person,
    square
  };
  console.log("personPlusSquare:", personPlusSquare);
  store.dispatch(actions.selectPerson(personPlusSquare));
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
    playerDetails.population.length !== 1
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
    setTimeout(() => {
      const sortedRecommendations = utils.randAndArrangeRecommendations(
        helper.runToRecommendations(targetZones, square)
      );
      store.dispatch(actions.addRecommendations(sortedRecommendations));
      store.dispatch(
        actions.addSnackbar({
          message: `${_.get(
            playersState,
            `details.${playersState.activePlayer}.name`
          )} ran a person from ${square} to ${sortedRecommendations[0].square}`,
          type: "success"
        })
      );
      runToSquare(sortedRecommendations[0].square);
    }, 750);
  }
};

/**
 * @function runForYourLives
 * @description player can now run two of their people
 */
export const runForYourLives = async () => {
  const storeState = store.getState();
  const {
    gridState,
    playersState
    // gamePlayState: { gameSettings: {autoPlayDisabled} }
  } = storeState;

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
    setTimeout(() => {
      const sortedRecommendations = utils.randAndArrangeRecommendations(
        helper.runnerRecommendations()
      );
      store.dispatch(actions.addRecommendations(sortedRecommendations));
      const startSquare = sortedRecommendations[0].square;
      const census = _.get(gridState, `grid.${startSquare}.occupants`);
      let selectedOccupant = "";
      census.forEach(occupant => {
        if (occupant.player === playersState.activePlayer) {
          selectedOccupant = occupant;
        }
      });
      selectRunner(selectedOccupant, startSquare);

      // if (!autoPlayDisabled) {
      //   console.log(`%c***AI (${playersState.activePlayer}) auto-draw NOW?`);
      // }
    }, 750);
  }
};
