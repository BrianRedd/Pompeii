/** @module MainContainer */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";

import actions from "../redux/Actions";
import * as types from "../types/types";
import * as constant from "../data/constants";
import { gridByColor } from "../data/gridData";

import Main from "./Main";

const mapStateToProps = state => {
  return {
    cardsState: state.cardsState,
    gridState: state.gridState,
    messageState: state.messageState,
    playersState: state.playersState,
    tileState: state.tileState
  };
};

const mapDispatchToProps = {
  gameSetup: actions.gameSetup,
  takeCard: actions.takeCard,
  discardCard: actions.discardCard,
  incrementPlayerTurn: actions.incrementPlayerTurn,
  updatePlayerHand: actions.updatePlayerHand,
  updateInstructions: actions.updateInstructions,
  placePeopleInSquare: actions.placePeopleInSquare,
  incrementStage: actions.incrementStage,
  incrementPlayerPopulation: actions.incrementPlayerPopulation,
  incrementPlayerCasualties: actions.incrementPlayerCasualties,
  takeTile: actions.takeTile
};

/**
 * @function MainContainer
 * @description Functional Container component for Main
 * @returns {React.Component} - Rendered component.
 */
const MainContainer = props => {
  const {
    cardsState,
    gridState,
    messageState,
    playersState,
    tileState,
    gameSetup,
    takeCard,
    discardCard,
    takeTile,
    incrementPlayerTurn,
    updatePlayerHand,
    updateInstructions,
    placePeopleInSquare,
    incrementStage,
    incrementPlayerPopulation,
    incrementPlayerCasualties
  } = props;

  const numberOfPlayers = 3;

  useEffect(() => {
    if (!_.get(cardsState.cards)) {
      gameSetup(numberOfPlayers);
    }
  }, [cardsState.cards, gameSetup]);

  const [activePlayer, setActivePlayer] = useState();

  useEffect(() => {
    setActivePlayer(_.get(playersState, `players[${playersState.turn}]`));
  }, [playersState]);

  const [cardGrid, setCardGrid] = useState([]);

  const [placingPersonFlag, setPlacingPersonFlag] = useState(false);

  const [numberOfRelatives, setNumberOfRelatives] = useState(0);
  const [placedRelatives, setPlacedRelatives] = useState([]);
  const [wildCardFlag, setWildCardFlag] = useState(false);

  const [omenFlag, setOmenFlag] = useState(false);
  const [ad79Flag, setAD79Flag] = useState(false);
  const [sacrificeMessage, setSacrificeMessage] = useState("");

  const [lavaFlag, setLavaFlag] = useState(false);
  const [lavaTile, setLavaTile] = useState();

  /**
   * @function placeRelatives
   * @description function when relatives is placed
   * @param {String} grid - grid where "parent" was placed
   */
  const placeRelatives = grid => {
    // current other occupants
    const currentOccupants = _.get(gridState, `grid.${grid}.occupants`, []);
    let thisPlacedRelatives = placedRelatives;

    // place relative in square
    placePeopleInSquare(grid, [
      ...currentOccupants,
      {
        player: activePlayer,
        gender: Math.round(Math.random()) ? "male" : "female"
      }
    ]);
    incrementPlayerPopulation(activePlayer, 1);
    thisPlacedRelatives = [...placedRelatives, grid];
    setPlacedRelatives(thisPlacedRelatives);
    setCardGrid([...cardGrid].filter(val => val !== grid));

    // if enough relatives have been placed, end relative placement
    if (thisPlacedRelatives.length === numberOfRelatives) {
      setNumberOfRelatives(0);
      setPlacedRelatives([]);
      setCardGrid([]);
      setPlacingPersonFlag(false);
      updateInstructions({
        text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
          constant.DRAW
        }`,
        color: _.get(playersState, `details[${activePlayer}].color`)
      });
    }
  };

  /**
   * @function placePerson
   * @description function when person is placed
   * @param {String} grid
   */
  const placePerson = grid => {
    // if number of relatives is set, place relative instead
    if (numberOfRelatives > 0) {
      placeRelatives(grid);
      return;
    }

    // current other occupants
    const currentOccupants = _.get(gridState, `grid.${grid}.occupants`, []);

    // place person in square
    placePeopleInSquare(grid, [
      ...currentOccupants,
      {
        player: activePlayer,
        gender: Math.round(Math.random()) ? "male" : "female"
      }
    ]);
    incrementPlayerPopulation(activePlayer, 1);

    // if there should be relatives, set relative states
    if (
      messageState.stage === 1 &&
      currentOccupants.length > 0 &&
      numberOfRelatives === 0 &&
      !wildCardFlag
    ) {
      setNumberOfRelatives(currentOccupants.length);
      setPlacedRelatives([]);
      const newGridArray = _.uniq([
        ...cardGrid,
        ...gridByColor.White,
        ...gridByColor[
          _.get(gridState, `grid.${grid}.buildingName`, "").split(" ")[0]
        ]
      ]).filter(val => val !== grid);
      setCardGrid(newGridArray);
      updateInstructions({
        text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
          constant.RELATIVE
        }`,
        color: _.get(playersState, `details[${activePlayer}].color`)
      });
    } else {
      // else complete placement
      setCardGrid([]);
      setPlacingPersonFlag(false);
      setWildCardFlag(false);
      updateInstructions({
        text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
          constant.DRAW
        }`,
        color: _.get(playersState, `details[${activePlayer}].color`)
      });
    }
  };

  /**
   * @function vacancy
   * @description checks for vacancy within a square
   * @param {String} square
   * @return {Boolean}
   */
  const vacancy = square => {
    if (
      _.get(gridState, `grid.${square}.occupants.length`, 0) <
      _.get(gridState, `grid.${square}.buildingCapacity`, 0)
    ) {
      return true;
    }
    return false;
  };

  /**
   * @function playPompCard
   * @description when player plays pompeii card
   * @param {String} card
   */
  const playPompCard = card => {
    let gridHighlights = cardsState.cards[card].grid.filter(val =>
      vacancy(val)
    );

    if (!gridHighlights.length) {
      gridHighlights = _.uniqBy([
        ...gridByColor.White,
        ...gridByColor.Grey,
        ...gridByColor.Purple,
        ...gridByColor.Turquoise,
        ...gridByColor.Brown
      ]).filter(val => vacancy(val));
      setWildCardFlag(true);
    }

    setPlacingPersonFlag(true);

    setCardGrid(gridHighlights);
    updateInstructions({
      text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
        constant.PLACE
      }`,
      color: _.get(playersState, `details[${activePlayer}].color`)
    });
  };

  /**
   * @function resolveAd79
   * @description resolve AD 79 card when drawn
   */
  const resolveAd79 = () => {
    setAD79Flag(true);
    if (messageState.stage === 1) {
      updateInstructions({
        text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
          constant.LAVA_TILE
        }`,
        color: _.get(playersState, `details[${activePlayer}].color`)
      });
      incrementPlayerTurn();
    }
    incrementStage();
  };

  /**
   * @function performSacrifice
   * @description upon selection of person, sacrifice if not your own
   * @param {String} id
   * @param {String} square
   */
  const performSacrifice = (id, square) => {
    const idArray = id.split("-");
    if (!omenFlag || idArray[0] === activePlayer) return;

    const currentOccupants = _.get(gridState, `grid.${square}.occupants`, []);
    const idx = currentOccupants.indexOf({
      player: idArray[0],
      gender: idArray[1]
    });
    currentOccupants.splice(idx, 1);
    setSacrificeMessage(
      `${_.get(
        playersState,
        `details[${activePlayer}].name`
      )} SACRIFICES one of ${_.get(
        playersState,
        `details[${idArray[0]}].name`
      )}'s people! (click to continue)`
    );
    placePeopleInSquare(square, currentOccupants);
    incrementPlayerCasualties(idArray[0], 1);

    updateInstructions({
      text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
        constant.DRAW
      }`,
      color: _.get(playersState, `details[${activePlayer}].color`)
    });
  };

  /**
   * @function resolveOmen
   * @description resolve Omen card when drawn - sacrifice another player's person
   */
  const resolveOmen = () => {
    updateInstructions({
      text: `${_.get(playersState, `details[${activePlayer}].name`)}: ${
        constant.SACRIFICE
      }`,
      color: _.get(playersState, `details[${activePlayer}].color`)
    });
    setOmenFlag(true);
  };

  /**
   * @function drawCard
   * @description draw card from deck
   */
  const drawCard = () => {
    // draw card
    const takenCard = cardsState.deck[cardsState.deck.length - 1];
    takeCard();

    // check for AD79
    if (_.get(cardsState, `cards[${takenCard}].type`) === constant.AD79) {
      discardCard(takenCard);
      resolveAd79();
      return;
    }

    // check for Omen
    if (_.get(cardsState, `cards[${takenCard}].type`) === constant.OMEN) {
      discardCard(takenCard);
      resolveOmen();
      return;
    }

    const newHand = [
      ..._.get(playersState, `details[${activePlayer}].hand`),
      takenCard
    ];

    // add card to player hand
    updatePlayerHand(activePlayer, newHand);

    // next player's turn
    incrementPlayerTurn();
  };

  /**
   * @function drawTile
   * @description drawing a tile during stage 3
   */
  const drawTile = () => {
    const tilePile = [...tileState.pile];

    // draw tile
    const takenTile = tilePile.pop();
    setLavaTile(takenTile);
    takeTile();

    setLavaFlag(true);

    // next player's turn
    // incrementPlayerTurn();
  };

  const placeLavaTile = tile => {
    console.log("Lava!", tile);
    setLavaFlag(false);

    // TO DO: Highlight available placements
    // Send to highlight function for selection
    // Place tile
    // Resolve any fatalities
    // Move to running function
    // (Six tiles placed before running begins)

    // next player's turn
    incrementPlayerTurn();
  };

  return (
    <div data-test="container-main">
      <Main
        cardsState={cardsState}
        gridState={gridState}
        messageState={messageState}
        playersState={playersState}
        tileState={tileState}
        drawCard={drawCard}
        discardCard={discardCard}
        updatePlayerHand={updatePlayerHand}
        deckEnabled={
          _.get(playersState, `details[${activePlayer}].hand.length`) < 4 &&
          !placingPersonFlag &&
          !omenFlag
        }
        pileEnabled={messageState.stage === 2}
        playPompCard={playPompCard}
        cardGrid={cardGrid}
        placePerson={placePerson}
        vacancy={vacancy}
        performSacrifice={performSacrifice}
        sacrificeMessage={sacrificeMessage}
        setSacrificeMessage={setSacrificeMessage}
        drawTile={drawTile}
        flags={{
          omenFlag,
          setOmenFlag,
          ad79Flag,
          setAD79Flag,
          lavaFlag,
          setLavaFlag
        }}
        lavaTile={lavaTile}
        placeLavaTile={placeLavaTile}
      />
    </div>
  );
};

MainContainer.propTypes = {
  cardsState: types.cardsState.types,
  gridState: types.gridState.types,
  messageState: types.messageState.types,
  playersState: types.playersState.types,
  tileState: types.tileState.types,
  gameSetup: PropTypes.func,
  takeCard: PropTypes.func,
  discardCard: PropTypes.func,
  takeTile: PropTypes.func,
  incrementPlayerTurn: PropTypes.func,
  updatePlayerHand: PropTypes.func,
  updateInstructions: PropTypes.func,
  placePeopleInSquare: PropTypes.func,
  incrementStage: PropTypes.func,
  incrementPlayerPopulation: PropTypes.func,
  incrementPlayerCasualties: PropTypes.func
};

MainContainer.defaultProps = {
  cardsState: types.cardsState.defaults,
  gridState: types.gridState.defaults,
  messageState: types.messageState.defaults,
  playersState: types.playersState.defaults,
  tileState: types.tileState.defaults,
  gameSetup: () => {},
  takeCard: () => {},
  discardCard: () => {},
  takeTile: () => {},
  incrementPlayerTurn: () => {},
  updatePlayerHand: () => {},
  updateInstructions: () => {},
  placePeopleInSquare: () => {},
  incrementStage: () => {},
  incrementPlayerPopulation: () => {},
  incrementPlayerCasualties: () => {}
};

export const MainContainerTest = MainContainer;
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
