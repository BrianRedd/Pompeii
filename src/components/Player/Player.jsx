/** @module Player */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";
import { Col, Row } from "reactstrap";
import _ from "lodash";

import * as types from "../../types/types";

import Card, { CardBack } from "../Helpers/Card";

const PeopleIcons = ({ number, color, type }) => {
  const peopleIcons = [];
  for (let i = 0; i < number; i += 1) {
    peopleIcons.push(
      <div key={i} className="person">
        <span className={`${type} fa-lg`} style={{ color: `rgb(${color})` }} />
      </div>
    );
  }
  return <div>{peopleIcons}</div>;
};

PeopleIcons.propTypes = {
  number: PropTypes.number,
  color: PropTypes.string,
  type: PropTypes.string
};

PeopleIcons.defaultProps = {
  number: 0,
  color: "255, 255, 255",
  type: "fa fa-male"
};

const HandCards = ({ hand, ai, myTurn, playCard }) => {
  if (hand.length > 0) {
    const handCards = hand.map((card, idx) => {
      const key = `${card}-${idx}`;
      return (
        <ButtonBase
          key={key}
          focusRipple
          onClick={() => playCard(idx)}
          disabled={
            !myTurn ||
            hand.length < 4 ||
            (hand.includes("AD79") && card !== "AD79") ||
            (hand.includes("OMEN") && card !== "OMEN")
          }
        >
          {myTurn && !ai ? <Card cardId={card} /> : <CardBack />}
        </ButtonBase>
      );
    });
    return handCards;
  }
  return null;
};

HandCards.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.string),
  ai: PropTypes.bool,
  myTurn: PropTypes.bool,
  playCard: PropTypes.func
};

HandCards.defaultProps = {
  hand: [],
  ai: false,
  myTurn: false,
  playCard: () => {}
};

/**
 * @function Player
 * @description Functional Presentational component for Player
 * @returns {React.Component} - Rendered component.
 */
const Player = props => {
  const { details, myTurn, playCard, stage, numberOfPlayers } = props;

  return (
    <fieldset
      data-test="presentation-player"
      className="mt-3"
      style={{
        height: myTurn
          ? "230px"
          : `${Math.min(
              230,
              (502 - numberOfPlayers * 14) / (numberOfPlayers - 1)
            )}px`,
        transition: "height 250"
      }}
    >
      <legend
        style={{ color: `rgb(${details.color})` }}
        className="d-flex w-100 justify-content-between"
      >
        <span className="font-weight-bold d-flex align-content-center">
          {`${details.name}`}
          {details.ai ? (
            <i className="fas fa-robot ml-1 fa-xs" />
          ) : (
            <i className="fas fa-user ml-1 fa-xs" />
          )}
        </span>
        {stage < 2 && (
          <span>Population: {_.get(details, "population", []).length}</span>
        )}
        {stage < 2 && <span>Casualites: {details.casualties}</span>}
      </legend>
      <div
        style={{
          backgroundColor: myTurn
            ? `rgba(${details.color}, 0.3)`
            : "transparent"
        }}
        className="my-turn-highlight"
      >
        {stage < 2 ? (
          <HandCards
            hand={details.hand}
            ai={details.ai}
            myTurn={myTurn}
            playCard={playCard}
          />
        ) : (
          <div style={{ color: `rgb(${details.color})` }} className="p-2">
            <Row className="ml-4 mr-4">
              <Col xs={4}>
                <h6 className="d-flex justify-content-center">Saved</h6>
                <PeopleIcons
                  number={details.saved}
                  color={details.color}
                  type="fas fa-grin-alt"
                />
              </Col>
              <Col xs={4}>
                <h6 className="d-flex justify-content-center">Population</h6>
                <PeopleIcons
                  number={details.population.length}
                  color={details.color}
                  type="fas fa-male"
                />
              </Col>
              <Col xs={4}>
                <h6 className="d-flex justify-content-center">Casualites</h6>
                <PeopleIcons
                  number={details.casualties}
                  color={details.color}
                  type="fas fa-dizzy"
                />
              </Col>
            </Row>
          </div>
        )}
      </div>
    </fieldset>
  );
};

Player.propTypes = {
  details: types.playerDetails.types,
  stage: PropTypes.number,
  numberOfPlayers: PropTypes.number,
  myTurn: PropTypes.bool,
  playCard: PropTypes.func
};

Player.defaultProps = {
  details: types.playerDetails.defaults,
  stage: 0,
  numberOfPlayers: 2,
  myTurn: false,
  playCard: () => {}
};

export default Player;
