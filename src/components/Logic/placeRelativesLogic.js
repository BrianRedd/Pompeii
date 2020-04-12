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
 * @param {String} square - square where "parent" was placed
 */
export const placeRelatives = square => {
  console.log("placeRelatives; square:", square);
  const storeState = store.getState();
  const {
    cardsState,
    flagsState,
    gamePlayState,
    gridState,
    playersState
  } = storeState;

  const playerDetails = _.get(
    playersState,
    `details.${playersState.activePlayer}`
  );
  // current other occupants
  const currentOccupants = _.get(gridState, `grid.${square}.occupants`, []);
  let thisPlacedRelatives = gamePlayState.placedRelatives;
  let orderedRecommendations = [];

  if (square) {
    const id = `P${playersState.players.indexOf(
      playersState.activePlayer
    )}-${_.get(
      playersState,
      `details.${playersState.activePlayer}.totalPieces`,
      0
    )}r`;
    // place relative in square
    const personObj = {
      id,
      player: playersState.activePlayer,
      gender: Math.round(Math.random()) ? "male" : "female"
    };
    console.log(
      `%c${playersState.activePlayer} placed person ${id} on square ${square}`,
      "color: blue;font-weight:bold;"
    );
    store.dispatch(
      actions.placePeopleInSquare(square, [...currentOccupants, personObj])
    );
    store.dispatch(
      actions.incrementPlayerPopulation(playersState.activePlayer, personObj)
    );
    thisPlacedRelatives = [...gamePlayState.placedRelatives, square];
    store.dispatch(actions.setPlacedRelatives(thisPlacedRelatives));
    if (playerDetails.ai) {
      const idx = gamePlayState.recommendations
        .map(rec => rec.square)
        .indexOf(square);
      gamePlayState.recommendations.splice(idx, 1);
      orderedRecommendations = randAndArrangeRecommendations(
        gamePlayState.recommendations
      );
      store.dispatch(actions.addRecommendations(orderedRecommendations));
    }
    store.dispatch(
      actions.setCardGrid([...cardsState.grid].filter(val => val !== square))
    );
    store.dispatch(
      actions.addSnackbar({
        message: `${playerDetails.name} places a relative at ${
          square.split("_")[1]
        } x ${square.split("_")[0]}`,
        type: "default"
      })
    );
  }

  // if enough relatives have been placed, end relative placement
  if (thisPlacedRelatives.length === flagsState.relativesCount || !square) {
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
};
