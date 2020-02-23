/** @module StartupActions */

import { generateDeck } from "./CardsActions";
import { addGrid } from "./GridActions";
import { updateInstructions } from "./MessageActions";
import { setPlayerArray, addPlayers } from "./PlayersActions";
import { playerColors } from "../../data/playerData";
import { gridSquares } from "../../data/gridData";
import * as constant from "../../data/constants";

export const gameSetup = numberOfPlayers => async dispatch => {
  let nop = numberOfPlayers;
  if (!nop) nop = Math.ceil(Math.random() * 3) + 1;
  if (nop < 2) nop = 2;
  if (nop > 4) nop = 4;
  const players = [];
  for (let i = 1; i <= nop; i += 1) {
    players.push(`player${i}`);
  }
  await dispatch(setPlayerArray(players));
  const details = {};
  players.forEach((player, idx) => {
    details[player] = {
      name: `Player ${idx + 1}`,
      hand: [],
      color: playerColors[idx]
    };
  });
  await dispatch(addGrid(gridSquares));
  const whiteGrid = [];
  Object.keys(gridSquares).forEach(square => {
    if (gridSquares[square].buildingName === "White") {
      whiteGrid.push(square);
    }
  });
  console.log("whiteGrid:", whiteGrid);
  await dispatch(addPlayers(details));
  await dispatch(generateDeck());
  await dispatch(
    updateInstructions({
      text: `Player 1: ${constant.PLAY}`,
      color: playerColors[0]
    })
  );
};
