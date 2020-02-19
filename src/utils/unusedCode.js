/* const Deck = ({ cardsState }) => {
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

const PlayerHand = props => {
  const { playerDetail, cards } = props;
  const playerHand = playerDetail.hand.map((card, idx) => {
    const key = `${card}-${idx}`;
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
  return playerHand;
};

const PlayerHands = props => {
  const {
    cardsState: { cards },
    playersState: { players, details }
  } = props;
  const playerHands = players.map(player => {
    return (
      <fieldset key={player}>
        <legend>{details[player].name}</legend>
        <PlayerHand playerDetail={details[player]} cards={cards} />
      </fieldset>
    );
  });
  return playerHands;
}; */

/* {_.get(cardsState, "deck") && <Deck cardsState={cardsState} />}
    {!_.isEmpty(playersState.details) && (
      <PlayerHands cardsState={cardsState} playersState={playersState} />
    )} */
