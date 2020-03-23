/** @module stageMaster */

export const stageOne = () => {
  // play card
  // - discard from hand
  // - add to discard pile
  // place person
  // - update square
  // - update player population
  // draw card
  // - if AD79, resolve, move on to StageTwo
  // increment player turn
  // update instructions
  // stageOne();
};

export const stageTwo = () => {
  // increment player turn
  // update instructions
  // play card
  // - discard from hand
  // - add to discard pile
  // place person
  // - update square
  // - update player population
  // place relative(s)
  // - update square(s)
  // - update player population
  // draw card
  // - if Omen, resolve:
  // - - sacrifice a piece
  // - - update target square
  // - - update target player population
  // - if AD79, resolve, move on to StageThree
  // stageTwo();
};

export const stageThree = () => {
  // increment player turn
  // update instructions
  // draw tile
  // - decrement tile pile
  // - if wild, choose one option
  // - place tile
  // - cover any surrounded areas with lava
  // - update square(s) population and lava status(es)
  // - update appropriate player populations
  // if number of pre-played tiles reached, continue, else stageThree();
  // select person(s) to run
  // - update source square
  // select run-to target
  // - if run-to is exit:
  // - - update player population and saved
  // - else:
  // - - update target square
  // if player has another available runner, repeat
  // game over check:
  // - no further pieces on board
  // - no more tiles to draw
  // - - if game over, burn remaining tiles, determine remaining casualties, determine and display winner
  // stageThree();
};
