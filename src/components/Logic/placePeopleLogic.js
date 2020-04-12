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
// eslint-disable-next-line import/no-cycle
import { drawCard } from "./cardLogic";

/**
 * @function placePerson
 * @description function when person is placed
 * @param {String} square
 */
export const placePerson = square => {
  console.log("placePerson; grid:", square);
  const storeState = store.getState();
  const {
    cardsState,
    flagsState,
    gamePlayState: {
      gameSettings: { autoPlayDisabled }
    },
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
    placeRelatives(square);
    return;
  }

  // current other occupants
  const currentOccupants = _.get(gridState, `grid.${square}.occupants`, []);

  // place person in square
  const id = `P${playersState.players.indexOf(
    playersState.activePlayer
  )}-${_.get(
    playersState,
    `details.${playersState.activePlayer}.totalPieces`,
    0
  )}p`;
  const personObj = {
    id,
    player: playersState.activePlayer,
    gender: Math.round(Math.random()) ? "male" : "female"
  };
  store.dispatch(
    actions.placePeopleInSquare(square, [...currentOccupants, personObj])
  );
  store.dispatch(
    actions.incrementPlayerPopulation(playersState.activePlayer, personObj)
  );
  store.dispatch(
    actions.addSnackbar({
      message: `${playerDetails.name} places a person at ${
        square.split("_")[1]
      } x ${square.split("_")[0]}`,
      type: "default"
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
        _.get(gridState, `grid.${square}.buildingName`, "").split(" ")[0]
      ]
    ]).filter(val => val !== square);
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

    if (
      _.get(playersState, `details.${playersState.activePlayer}.ai`) &&
      !autoPlayDisabled
    ) {
      setTimeout(() => {
        console.log(
          `%c***AI (${playersState.activePlayer}) auto-drawing!`,
          "color: green; font-weight: bold"
        );
        drawCard();
      }, 500);
    }
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

    if (
      _.get(playersState, `details.${playersState.activePlayer}.ai`) &&
      !autoPlayDisabled
    ) {
      setTimeout(() => {
        console.log(
          `%c***AI (${playersState.activePlayer}) auto-drawing!`,
          "color: green; font-weight: bold"
        );
        drawCard();
      }, 500);
    }
  }
};

/**
 * @function performSacrifice
 * @description upon selection of person, sacrifice if not your own
 * @param {Object} personObj
 * @param {String} square
 * @param {Boolean} ai - is sacrifice performed by AI?
 */
export const performSacrifice = (personObj, square, ai) => {
  console.log("performSacrifice; personObj:", personObj, "square:", square, ai);
  const storeState = store.getState();
  const {
    flagsState,
    // gamePlayState: {
    //   gameSettings: { autoPlayDisabled }
    // },
    gridState,
    playersState
  } = storeState;

  if (
    !ai &&
    (!flagsState.flags.includes("card-omen") ||
      personObj.player === playersState.activePlayer)
  ) {
    return;
  }
  const currentOccupants = _.get(gridState, `grid.${square}.occupants`, []);

  const idx = currentOccupants
    .map(person => person.player)
    .indexOf(personObj.player);
  const sacrified = currentOccupants.splice(idx, 1);

  store.dispatch(actions.placePeopleInSquare(square, currentOccupants));
  store.dispatch(
    actions.incrementPlayerCasualties(personObj.player, sacrified[0])
  );
  store.dispatch(
    actions.updateInstructions({
      text: `${_.get(
        playersState,
        `details.${playersState.activePlayer}.name`
      )}: ${constant.DRAW}`,
      color: _.get(playersState, `details.${playersState.activePlayer}.color`)
    })
  );
  if (flagsState.flags.includes("card-omen")) {
    store.dispatch(actions.toggleFlags("card-omen"));
  }
};
