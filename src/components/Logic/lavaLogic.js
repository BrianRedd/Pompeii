/** @module lavaLogic */

import _ from "lodash";

import store from "../../redux/configureStore";
import actions from "../../redux/Actions";
import * as data from "../../data/gridData";
import * as utils from "../../utils/utilsCommon";

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
        store.dispatch(actions.addRecommendations(sortedEvaluations));
      }

      store.dispatch(actions.setDangerZone(filteredZones));
    } else if (!flagsState.flags.includes("no-place-to-place")) {
      store.dispatch(actions.toggleFlags("no-place-to-place"));
    }
  }
};

/**
 * @function drawTile
 * @description drawing a tile during stage 3
 */
export const drawTile = () => {
  console.log("drawTile");
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
