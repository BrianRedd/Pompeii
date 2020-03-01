/** @module StartupActions */

import _ from "lodash";

import { generateDeck } from "./CardsActions";
import { addGrid } from "./GridActions";
import { updateInstructions } from "./MessageActions";
import { setPlayerArray, addPlayers } from "./PlayersActions";
import { generatePile } from "./TilesActions";
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
      color: playerColors[idx],
      casualties: 0,
      population: 0,
      saved: 0
    };
  });

  const testMode = true;
  if (testMode) {
    // START PRE-POPULATION (TEST)
    const playersArray = ["player1", "player2", "player3"];
    const gridKeys = Object.keys(gridSquares);
    gridKeys.forEach(grid => {
      const potentialPop = _.get(gridSquares, `${grid}.buildingCapacity`, 0);
      const actualPop = Math.round(Math.random() * potentialPop);
      const occupants = [];
      for (let i = 0; i < actualPop; i += 1) {
        const player = playersArray[Math.floor(Math.random() * 3)];
        occupants.push({
          player,
          gender: Math.floor(Math.random() * 2) === 1 ? "male" : "female"
        });
        details[player].population += 1;
      }
      gridSquares[grid].occupants = occupants;
    });
    // END PRE-POPULATION (TEST)
  }

  await dispatch(addGrid(gridSquares));
  await dispatch(addPlayers(details));
  await dispatch(generateDeck());
  await dispatch(generatePile());
  await dispatch(
    updateInstructions({
      text: `Player 1: ${constant.PLAY}`,
      color: playerColors[0]
    })
  );
};
