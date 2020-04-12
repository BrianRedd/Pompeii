/** @module lavaLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
import actions from "../../redux/Actions";
import * as data from "../../data/gridData";
import * as utils from "../../utils/utilsCommon";
import * as helper from "./helperFunctions";
// eslint-disable-next-line import/no-cycle
import * as runnerLogic from "./runnerLogic";

/**
 * @function burnSurroundedTiles
 * @description if tiles are surrounded by lava, burn 'em all
 * @param {Array} tiles
 */
export const burnSurroundedTiles = tiles => {
  console.log("burnSurroundedTiled");
  const storeState = store.getState();
  const { gridState } = storeState;

  tiles.forEach(tile => {
    store.dispatch(actions.placeLavaTileOnSquare(tile, "Lava"));

    _.get(gridState, `grid.${tile}.occupants`, []).forEach(person => {
      store.dispatch(actions.incrementPlayerCasualties(person.player, person));
    });
    store.dispatch(actions.placePeopleInSquare(tile, []));
  });
};

/**
 * @function placeLavaTile
 * @description placing tile in highlight area
 * @param {String} square
 */
export const placeLavaTile = square => {
  const storeState = store.getState();
  const {
    flagsState,
    gamePlayState: {
      gameSettings: { autoPlayDisabled }
    },
    gridState,
    playersState,
    tileState
  } = storeState;

  console.log("placeLavaTile:", tileState.lavaTile, square);
  store.dispatch(actions.placeLavaTileOnSquare(square, tileState.lavaTile));

  _.get(gridState, `grid.${square}.occupants`, []).forEach(person => {
    store.dispatch(actions.incrementPlayerCasualties(person.player, person));
  });
  store.dispatch(actions.placePeopleInSquare(square, []));

  if (flagsState.flags.includes("placing-lava-tile")) {
    store.dispatch(actions.toggleFlags("placing-lava-tile"));
  }
  store.dispatch(actions.setLavaTile());
  store.dispatch(actions.setDangerZone([]));
  store.dispatch(actions.addRecommendations([]));

  // check for tiles surrounded by lava
  const tilesSurroundedByLava = helper.checkForSurroundedTiles(
    square,
    store.dispatch(actions.updateDistanceToExit)
  );
  if (tilesSurroundedByLava.length > 0) {
    burnSurroundedTiles(tilesSurroundedByLava);
  }

  if (flagsState.eruptionCount) {
    store.dispatch(actions.setEruptionCounter(flagsState.eruptionCount - 1));
    let amIAI = false;
    if (
      _.get(playersState, `details.${playersState.activePlayer}.ai`) &&
      !autoPlayDisabled
    ) {
      amIAI = true;
      setTimeout(() => {
        console.log(
          `%c***AI (${playersState.activePlayer}) is auto-drawing a lava tile! (${flagsState.eruptionCount})`,
          "color: green; font-weight: bold"
        );
        console.log("%cCheck if NEXT PLAYER is AI", "color: chartreuse;");
        // eslint-disable-next-line no-use-before-define
        drawTile();
      }, 1000);
    }
    const nextPlayer = (playersState.turn + 1) % playersState.players.length;

    store.dispatch(actions.incrementPlayerTurn());
    if (
      _.get(playersState, `details.${playersState.players[nextPlayer]}.ai`) &&
      !amIAI
    ) {
      setTimeout(() => {
        console.log(
          `%c***AI (${playersState.players[nextPlayer]}) is auto-drawing a lava tile!`,
          "color: green; font-weight: bold"
        );
        console.log("%cCheck if NEXT PLAYER is AI", "color: chartreuse;");
        // eslint-disable-next-line no-use-before-define
        drawTile();
      }, 1000);
    }
  } else if (
    _.get(playersState, `details.${playersState.activePlayer}.population`, [])
      .length < 1
  ) {
    if (
      _.get(playersState, `details.${playersState.activePlayer}.ai`) &&
      !autoPlayDisabled
    ) {
      setTimeout(() => {
        console.log(
          `%c***AI (${playersState.activePlayer}) is auto-drawing a lava tile! (no population)`,
          "color: green; font-weight: bold"
        );
        console.log("%cCheck if NEXT PLAYER is AI", "color: chartreuse;");
        // eslint-disable-next-line no-use-before-define
        drawTile();
      }, 1000);
    } else {
      console.log(
        "Human Player just placed a tile; should AI be able play now?"
      );
    }
    store.dispatch(actions.incrementPlayerTurn());
  } else {
    console.log(
      "%cset run counter to 2 and continue",
      "color: fuschia;font-weight:bold;"
    );
    store.dispatch(actions.setRunCounter(2));
    runnerLogic.runForYourLives();
  }
};

/**
 * @function highlightDangerZones
 * @description send list of available tiles to highlight component
 * @param {String} tile - picked lava tile
 */
export const highlightDangerZones = tile => {
  console.log("highlightDangerZones; tile:", tile);
  const storeState = store.getState();
  const { flagsState, gridState, playersState } = storeState;

  store.dispatch(actions.setLavaTile(tile));

  if (flagsState.flags.includes("placing-lava-tile")) {
    store.dispatch(actions.toggleFlags("placing-lava-tile"));
  }
  if (flagsState.flags.includes("lava-tile")) {
    store.dispatch(actions.toggleFlags("lava-tile"));
  }

  const hotZones = [];
  let homeVent = "";
  let recommendations = [];
  const gridKeys = Object.keys(gridState.grid);
  gridKeys.forEach(key => {
    if (_.get(gridState, `grid.${key}.lava`) === tile) {
      hotZones.push(key);
    }
    if (_.get(gridState, `grid.${key}.ventName`) === tile) {
      homeVent = key;
    }
  });

  const playerDetails = _.get(
    playersState,
    `details.${playersState.activePlayer}`
  );
  if (!hotZones.length) {
    if (playerDetails.ai) {
      store.dispatch(
        actions.addRecommendations([{ square: homeVent, value: 1 }])
      );
      recommendations = [{ square: homeVent, value: 1 }];
      placeLavaTile(recommendations[0].square);
      store.dispatch(
        actions.addSnackbar({
          message: `${_.get(
            playersState,
            `details.${playersState.activePlayer}.name`
          )} places ${tile} lava at ${recommendations[0].square}`,
          type: "default"
        })
      );
    }
    store.dispatch(actions.setDangerZone([homeVent]));
  } else {
    const warmZones = [];
    hotZones.forEach(zone => {
      const coord = zone.split("_");
      warmZones.push(
        `${Math.min(parseFloat(coord[0]) + 1, 6)}_${coord[1]}`,
        `${Math.max(parseFloat(coord[0]) - 1, 0)}_${coord[1]}`,
        `${coord[0]}_${Math.min(parseFloat(coord[1]) + 1, 10)}`,
        `${coord[0]}_${Math.max(parseFloat(coord[1]) - 1, 0)}`
      );
    });
    const filteredZones = _.uniqBy(
      warmZones.filter(zone => {
        return (
          !_.get(gridState, `grid.${zone}.lava`) &&
          !data.voidLavaSquares.includes(zone)
        );
      })
    );
    if (filteredZones.length) {
      if (playerDetails.ai) {
        // recommendations
        const evaluations = [];
        filteredZones.forEach(zone => {
          let value = 1 + _.get(gridState, `grid.${zone}.occupants.length`);
          if (
            _.get(gridState, `grid.${zone}.occupants`)
              .map(occupant => occupant.player)
              .includes(playersState.activePlayer)
          ) {
            value = -2;
          }

          evaluations.push({
            square: zone,
            value
          });
        });
        const sortedEvaluations = utils.randAndArrangeRecommendations(
          evaluations
        );
        recommendations = sortedEvaluations;
        store.dispatch(actions.addRecommendations(sortedEvaluations));
      }

      store.dispatch(actions.setDangerZone(filteredZones));
      if (playerDetails.ai) {
        placeLavaTile(recommendations[0].square);
        store.dispatch(
          actions.addSnackbar({
            message: `${_.get(
              playersState,
              `details.${playersState.activePlayer}.name`
            )} places ${tile} lava at ${recommendations[0].square}`,
            type: "default"
          })
        );
      }
    } else if (!flagsState.flags.includes("no-place-to-place")) {
      store.dispatch(actions.toggleFlags("no-place-to-place"));
    }
  }
};

/**
 * @function drawTile
 * @description drawing a tile during stage 3
 */
export const drawTile = human => {
  console.log("drawTile", human ? "by a human!" : "");
  const storeState = store.getState();
  const { flagsState, tileState } = storeState;

  const tilePile = [...tileState.pile];
  if (!flagsState.flags.includes("placing-lava-tile")) {
    store.dispatch(actions.toggleFlags("placing-lava-tile"));
  }

  // draw tile
  const takenTile = tilePile.pop();
  store.dispatch(actions.setLavaTile(takenTile));

  store.dispatch(actions.takeTile());

  const wilds = _.get(tileState, `tiles.${takenTile}.wilds`);
  if (wilds) {
    store.dispatch(actions.toggleFlags("wild-lava-tile"));
  } else {
    highlightDangerZones(takenTile);
  }
  if (!flagsState.flags.includes("lava-tile")) {
    store.dispatch(actions.toggleFlags("lava-tile"));
  }
};
