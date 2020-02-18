/** @module Main */

import React from "react";
import _ from "lodash";
import { Tooltip } from "@material-ui/core";

import * as types from "../types/types";

import Board from "./Board/Board";

const Deck = ({ cardsState }) => {
  const { cards, deck } = cardsState;
  const deckArray = deck.map((card, idx) => {
    const key = `${card}_${idx}`;
    return (
      <Tooltip key={key} title={`${idx + 1}: ${cards[card].name}`}>
        <span>
          <img
            className="pompeii-card"
            alt={cards[card].name}
            src={`/assets/cards/${cards[card].type}-${cards[card].number}-${cards[card].color}.png`}
          />
        </span>
      </Tooltip>
    );
  });
  return deckArray;
};

const Main = props => {
  const { cardsState } = props;

  return (
    <div data-test="presentation-main">
      {_.get(cardsState, "deck") && <Deck cardsState={cardsState} />}
      <Board />
    </div>
  );
};

Main.propTypes = {
  cardsState: types.cardsState.types
};

Main.defaultProps = {
  cardsState: types.cardsState.defaults
};

export default Main;
