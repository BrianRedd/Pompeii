/** @module placePeopleLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
import * as data from "../../data/gridData";
import { aiPlayers } from "../../data/playerData";
import * as constant from "../../data/constants";
import { randAndArrangeRecommendations } from "../../utils/utilsCommon";
import actions from "../../redux/Actions";

// eslint-disable-next-line import/no-cycle
import { placeRelatives } from "./placeRelativesLogic";

/**
 * @function placePerson
 * @description function when person is placed
 * @param {String} grid
 */
export const placePerson = grid => {
  console.log("placePerson; grid:", grid);
  const storeState = store.getState();
  const {
    cardsState,
    flagsState,
    gridState,
    messageState,
    playersState
  } = storeState;

  const playerDetails = _.get(
    playersState,
    `details.${playersState.activePlayer}`
  );

  // if number of relatives is set, place relative instead
  if (flagsState.relativesCount > 0) {
    placeRelatives(grid);
    return;
  }

  // current other occupants
  const currentOccupants = _.get(gridState, `grid.${grid}.occupants`, []);

  // place person in square
  store.dispatch(
    actions.placePeopleInSquare(grid, [
      ...currentOccupants,
      {
        player: playersState.activePlayer,
        gender: Math.round(Math.random()) ? "male" : "female"
      }
    ])
  );
  store.dispatch(
    actions.incrementPlayerPopulation(playersState.activePlayer, 1)
  );
  store.dispatch(
    actions.addSnackbar({
      message: `${playerDetails.name} places a person at ${
        grid.split("_")[1]
      } x ${grid.split("_")[0]}`,
      type: "success"
    })
  );
  store.dispatch(actions.addRecommendations([]));

  // if there should be relatives, set relative states
  if (
    messageState.stage === 1 &&
    currentOccupants.length > 0 &&
    flagsState.relativesCount === 0 &&
    !flagsState.flags.includes("card-wild")
  ) {
    store.dispatch(actions.setRelativesCounter(currentOccupants.length));
    store.dispatch(actions.setPlacedRelativesToStore([]));
    const newGridArray = _.uniq([
      ...cardsState.grid,
      ...data.gridByColor.White,
      ...data.gridByColor[
        _.get(gridState, `grid.${grid}.buildingName`, "").split(" ")[0]
      ]
    ]).filter(val => val !== grid);
    store.dispatch(actions.setCardGrid(newGridArray));

    if (playerDetails.ai) {
      // placement evaluation/recommendations:
      const aiPlayer =
        aiPlayers[
          _.get(playersState, `details.${playersState.activePlayer}.name`)
        ];
      const evaluations = [];
      let handCanPlaceHere = [];
      const playerHand = playerDetails.hand;
      playerHand.forEach(card => {
        handCanPlaceHere = [
          ...handCanPlaceHere,
          ..._.get(cardsState, `cards.${card}.grid`)
        ];
      });
      newGridArray.forEach(newGrid => {
        // criteria:
        // - if empty colored build matching card in hand (capacity - 1)
        const gridDetail = _.get(gridState, `grid.${newGrid}`);
        let value = 1;
        if (data.nextToVentSquares.includes(newGrid)) {
          value -= 0.5 * aiPlayer.cautious; // next to vent, reduce delta
        }
        value += (5 - gridDetail.distanceToExit) * 0.5; // distance to exit; modified by strategy
        const availableSpace =
          gridDetail.buildingCapacity - gridDetail.occupants.length;
        if (availableSpace > 0 && gridDetail.buildingName === "White") {
          value += 1 + gridDetail.occupants.length;
          value += _.uniqBy(
            gridDetail.occupants.map(occupant => occupant.player)
          ).length;
        }
        if (
          gridDetail.occupants.length === 0 &&
          handCanPlaceHere.includes(newGrid)
        ) {
          value *= 2;
        }
        if (availableSpace < 1) {
          value = -1;
        }
        evaluations.push({
          square: newGrid,
          value
        });
      });
      const orderedEvaluations = randAndArrangeRecommendations(evaluations);
      store.dispatch(actions.addRecommendations(orderedEvaluations));

      // AI: Place first relative
      setTimeout(() => {
        placePerson(orderedEvaluations[0].square);
      }, 500);
    }

    store.dispatch(
      actions.updateInstructions({
        text: `${playerDetails.name}: ${constant.RELATIVE}`,
        color: playerDetails.color
      })
    );
  } else {
    // else complete placement
    store.dispatch(actions.setCardGrid([]));
    if (flagsState.flags.includes("placing-person")) {
      store.dispatch(actions.toggleFlags("placing-person"));
    }
    if (flagsState.flags.includes("card-wild")) {
      store.dispatch(actions.toggleFlags("card-wild"));
    }
    store.dispatch(
      actions.updateInstructions({
        text: `${playerDetails.name}: ${constant.DRAW}`,
        color: playerDetails.color
      })
    );
  }
};
