/** @module lavaLogic */

/**
 * @function drawTile
 * @description drawing a tile during stage 3
 */
export const drawTile = () => {
  console.log("drawTile");
  const tilePile = [...tileState.pile];
  if (!flagsState.flags.includes("placing-lava-tile")) {
    toggleFlags("placing-lava-tile");
  }

  // draw tile
  const takenTile = tilePile.pop();
  setLavaTile(takenTile);
  takeTile();

  const wilds = _.get(tileState, `tiles.${takenTile}.wilds`);
  if (wilds) {
    toggleFlags("wild-lava-tile");
  } else {
    highlightDangerZones(takenTile);
  }
  if (!flagsState.flags.includes("lava-tile")) {
    toggleFlags("lava-tile");
  }
};
