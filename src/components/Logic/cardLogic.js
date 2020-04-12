/** @module cardLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
import actions from "../../redux/Actions";
import * as data from "../../data/gridData";
import { aiPlayers } from "../../data/playerData";
import * as constant from "../../data/constants";
import { randAndArrangeRecommendations } from "../../utils/utilsCommon";
import * as helper from "./helperFunctions";
import * as lavaLogic from "./lavaLogic";
// eslint-disable-next-line import/no-cycle
import * as placePeopleLogic from "./placePeopleLogic";

/**
 * @function playPompCard
 * @description when player plays pompeii card
 * @param {String} card
 */
export const playPompCard = card => {
  console.log("playPompCard; card:", card);
  const storeState = store.getState();
  const { cardsState, gamePlayState, flagsState, playersState } = storeState;

  store.dispatch(actions.discardCard(card));
  const thisHand = [...playersState.details[playersState.activePlayer].hand];
  const cardIdx = thisHand.indexOf(card);
  thisHand.splice(cardIdx, 1);
  store.dispatch(actions.updatePlayerHand(playersState.activePlayer, thisHand));

  let gridHighlights = cardsState.cards[card].grid.filter(val =>
    helper.vacancy(val)
  );

  if (!gridHighlights.length) {
    gridHighlights = _.uniqBy([
      ...data.gridByColor.White,
      ...data.gridByColor.Grey,
      ...data.gridByColor.Purple,
      ...data.gridByColor.Turquoise,
      ...data.gridByColor.Brown
    ]).filter(val => helper.vacancy(val));
    if (!flagsState.flags.includes("card-wild")) {
      store.dispatch(actions.toggleFlags("card-wild"));
    }
  }

  if (!flagsState.flags.includes("placing-person")) {
    store.dispatch(actions.toggleFlags("placing-person"));
  }

  store.dispatch(actions.setCardGrid(gridHighlights));
  store.dispatch(
    actions.updateInstructions({
      text: `${_.get(
        playersState,
        `details.${playersState.activePlayer}.name`
      )}: ${constant.PLACE}`,
      color: _.get(playersState, `details.${playersState.activePlayer}.color`)
    })
  );
  // AI: Place person
  if (playersState.details[playersState.activePlayer].ai) {
    setTimeout(() => {
      placePeopleLogic.placePerson(
        _.get(gamePlayState, "recommendations[0].square")
      );
    }, 1000);
  }
};

/**
 * @function chooseCardToPlay
 * @description based on player hand and AI strategy, set play recommendations
 */
export const chooseCardToPlay = () => {
  const storeState = store.getState();
  const {
    playersState,
    gridState,
    cardsState,
    messageState: { stage }
  } = storeState;

  const playerDetails = _.get(
    playersState,
    `details.${playersState.players[playersState.turn]}`
  );
  const gridArray = Object.keys(gridState.grid).map(item => {
    return {
      ...gridState.grid[item],
      id: item
    };
  });
  // check for AI player
  if (stage < 2 && playerDetails.ai) {
    const aiPlayer =
      aiPlayers[
        _.get(playersState, `details.${playersState.activePlayer}.name`)
      ];
    const activePlayerHand = playerDetails.hand;
    // START recommendations (ai's only)
    if (activePlayerHand.length === 4) {
      const targetSpaces = [];
      activePlayerHand.forEach(card => {
        targetSpaces.push(...cardsState.cards[card].grid);
      });
      const evaluations = {};
      // evaluate each square
      targetSpaces.forEach(target => {
        let delta;
        const fullBuilding = gridArray.filter(
          square => square.buildingName === gridState.grid[target].buildingName
        );
        let fullOccupancy = 0;
        // stage 1
        if (stage === 0) {
          delta = gridState.grid[target].buildingCapacity; // + building capacity
          fullBuilding.forEach(room => {
            fullOccupancy += room.occupants.length;
          });
          delta -= fullOccupancy * (2 + aiPlayer.social); // - full building occupancy (x3)
          if (data.nextToVentSquares.includes(target)) {
            delta -= 0.5 * aiPlayer.cautious; // next to vent, reduce delta;
          }
          delta +=
            (5 - _.get(gridState, `grid.${target}.distanceToExit`)) * 0.5; // distance to exit; modified by strategy

          if (evaluations[target]) {
            evaluations[target].value += delta + 1; // if multiple copies of card, compound delta
          } else {
            evaluations[target] = {
              value: delta
            };
          }
        }
        // stage 2
        if (stage === 1) {
          delta =
            gridState.grid[target].buildingCapacity -
            gridState.grid[target].occupants.length; // + building capacity - building occupancy
          if (delta) {
            delta +=
              gridState.grid[target].occupants.length * (2 + aiPlayer.social); // + building occupancy
            const diversity = _.uniqBy(
              _.get(gridState, `grid.${target}.occupants`, []).map(
                occ => occ.player
              )
            ).length; // diversity
            if (diversity > 0) {
              delta += (diversity - 1) * 0.5 * aiPlayer.social;
            }
            if (data.nextToVentSquares.includes(target)) {
              delta -= 0.5 * aiPlayer.cautious; // next to vent, reduce delta;
            }
            delta +=
              (5 - _.get(gridState, `grid.${target}.distanceToExit`)) *
              0.5 *
              aiPlayer.cautious; // distance to exit; modified by strategy
          }
          if (evaluations[target]) {
            evaluations[target].value += delta + 1; // if multiple copies of card, compound delta
          } else {
            evaluations[target] = {
              value: delta
            };
          }
        }
      });
      const recommendations = Object.keys(evaluations).map(evals => {
        return {
          square: evals,
          value: evaluations[evals].value
        };
      });
      const updatedRecommendations = randAndArrangeRecommendations(
        recommendations
      );
      store.dispatch(actions.addRecommendations(updatedRecommendations));
      // AI: play card
      const playThisCard = helper.AIDetermineCardToPlay();
      if (playThisCard) {
        playPompCard(playThisCard);
      }
    }
    // END recommendations (ai's only)
  }
};

/**
 * @function resolveAd79
 * @description resolve AD 79 card when drawn
 */
export const resolveAd79 = () => {
  console.log("resolveAd79");
  const storeState = store.getState();
  const {
    flagsState,
    gamePlayState: {
      gameSettings: { autoPlayDisabled }
    },
    messageState,
    playersState
  } = storeState;

  if (!flagsState.flags.includes("card-ad79")) {
    store.dispatch(actions.toggleFlags("card-ad79"));
  }
  setTimeout(() => {
    if (messageState.stage === 1) {
      const nextPlayer = (playersState.turn + 1) % playersState.players.length;
      store.dispatch(actions.incrementPlayerTurn());
      store.dispatch(
        actions.updateInstructions({
          text: `${_.get(
            playersState,
            `details.${playersState.players[nextPlayer]}.name`
          )}: ${constant.LAVA_TILE}`,
          color: _.get(
            playersState,
            `details.${playersState.players[nextPlayer]}.color`
          )
        })
      );
      if (
        _.get(playersState, `details.${playersState.activePlayer}.ai`) &&
        !autoPlayDisabled
      ) {
        setTimeout(() => {
          console.log(
            `%c***AI (${playersState.activePlayer}) clicking SECOND AD79!`,
            "color: green; font-weight: bold"
          );
          store.dispatch(actions.toggleFlags("card-ad79"));
          lavaLogic.drawTile();
        }, 1000);
      } /* else if (
        _.get(
          playersState,
          `details.${playersState.players[nextPlayer]}.ai` && !autoPlayDisabled
        )
      ) {
        setTimeout(() => {
          console.log(
            `%c***AI (${playersState.players[nextPlayer]}) is auto-drawing a lava tile!`,
            "color: green; font-weight: bold"
          );
          lavaLogic.drawTile();
        }, 1000);
      } */ else {
        console.log(
          `%c***If player AFTER ${playersState.activePlayer} is AI, should they auto-draw now?`,
          "color: purple; font-weight: bold"
        );
      }
    } else if (
      _.get(playersState, `details.${playersState.activePlayer}.ai`) &&
      !autoPlayDisabled
    ) {
      setTimeout(() => {
        console.log(
          `%c***AI (${playersState.activePlayer}) clicking FIRST AD79!`,
          "color: green; font-weight: bold"
        );
        store.dispatch(actions.toggleFlags("card-ad79"));
        // eslint-disable-next-line no-use-before-define
        drawCard();
      }, 1000);
    }
  }, 100);

  store.dispatch(actions.addRecommendations([]));
  store.dispatch(actions.incrementStage());
};

/**
 * @function resolveOmen
 * @description resolve Omen card when drawn - sacrifice another player's person
 */
export const resolveOmen = () => {
  console.log("resolveOmen");
  const storeState = store.getState();
  const {
    gamePlayState: {
      gameSettings: { autoPlayDisabled }
    },
    gridState,
    flagsState,
    playersState
  } = storeState;

  const playerDetails = _.get(
    playersState,
    `details.${playersState.activePlayer}`
  );
  store.dispatch(
    actions.updateInstructions({
      text: `${playerDetails.name}: ${constant.SACRIFICE}`,
      color: playerDetails.color
    })
  );

  // ai performing sacrifice
  if (playerDetails.ai) {
    setTimeout(() => {
      const playersArray = [];
      Object.keys(_.get(playersState, "details")).forEach(player => {
        playersArray.push({
          ...playersState.details[player],
          player
        });
      });
      const playersScores = playersArray
        .filter(player => player.player !== playersState.activePlayer)
        .sort((a, b) =>
          // TODO if chaotic, perhaps a 0-1 to this comparison
          a.population.length - a.casualties.length * 0.1 <
          b.population.length - b.casualties.length * 0.1
            ? 1
            : -1
        );
      const target = playersScores[0];
      const census = [];
      Object.keys(_.get(gridState, "grid")).forEach(square => {
        _.get(gridState, `grid.${square}.occupants`, []).forEach(occupant => {
          census.push({
            player: occupant.player,
            square,
            personObj: occupant
          });
        });
      });
      const targetList = census.filter(person => {
        return person.player === target.player;
      });
      if (targetList.length > 0) {
        const rand = Math.floor(Math.random() * targetList.length);
        placePeopleLogic.performSacrifice(
          targetList[rand].personObj,
          targetList[rand].square,
          true
        );
      }
      if (!autoPlayDisabled) {
        setTimeout(() => {
          console.log(
            `%c***AI (${playersState.activePlayer}), after murdering an innocent, is drawing a card!!!`,
            "color: green; font-weight: bold"
          );
          // eslint-disable-next-line no-use-before-define
          drawCard();
        }, 1000);
      }
    }, 1000);
  } else if (!flagsState.flags.includes("card-omen")) {
    store.dispatch(actions.toggleFlags("card-omen"));
  }
};

/**
 * @function drawCard
 * @description draw card from deck
 */
export const drawCard = () => {
  console.log("drawCard");
  const storeState = store.getState();
  const { playersState, cardsState } = storeState;

  // draw card
  const takenCard = cardsState.deck[cardsState.deck.length - 1];
  store.dispatch(actions.takeCard());

  // check for AD79
  if (_.get(cardsState, `cards.${takenCard}.type`) === constant.AD79) {
    store.dispatch(actions.discardCard(takenCard));
    resolveAd79();
    return;
  }

  // check for Omen
  if (_.get(cardsState, `cards.${takenCard}.type`) === constant.OMEN) {
    store.dispatch(actions.discardCard(takenCard));
    resolveOmen();
    return;
  }

  const newHand = [
    ..._.get(playersState, `details.${playersState.activePlayer}.hand`, []),
    takenCard
  ];

  store.dispatch(actions.incrementPlayerTurn());
  // add card to player hand
  setTimeout(() => {
    store.dispatch(
      actions.updatePlayerHand(playersState.activePlayer, newHand)
    );
  }, 0);
};
