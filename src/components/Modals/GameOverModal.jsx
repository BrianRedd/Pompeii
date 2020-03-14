/** @module GameOverModal */

import React from "react";
import PropTypes from "prop-types";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Button } from "@material-ui/core";
import _ from "lodash";

import * as types from "../../types/types";

import "./styles/modals.scss";

const PlayerStats = ({ details, winner }) => {
  const detailsArray = Object.keys(details);
  const playersStats = detailsArray.map(player => {
    return (
      <Col xs={12 / detailsArray.length} key={player}>
        <h5 style={{ color: `rgb(${details[player].color})` }}>
          {details[player].name}
          {winner && winner === player && (
            <span className="color-gold ml-2 fas fa-trophy fa-lg" />
          )}
        </h5>
        <Row>
          <Col xs={6}>Saved:</Col>
          <Col xs={6}>{details[player].saved}</Col>
        </Row>
        <Row>
          <Col xs={6}>Casualties:</Col>
          <Col xs={6}>{details[player].casualties}</Col>
        </Row>
        <Row>
          <Col xs={6}>Population:</Col>
          <Col xs={6}>{details[player].population}</Col>
        </Row>
      </Col>
    );
  });
  return playersStats;
};

/**
 * @function GameOverModal
 * @description Functional Presentational component for Game Over Modal
 * @returns {React.Component} - Rendered component.
 */
const GameOverModal = props => {
  const {
    isOpen,
    playersState,
    acceptGameOver,
    statisticsOnly,
    toggleFlags,
    rankings
  } = props;

  const tie = !!(
    !statisticsOnly && rankings[0].victoryPoints === rankings[1].victoryPoints
  );

  return (
    <Modal data-test="modal-game-over" isOpen={isOpen} className="modal-lg">
      {statisticsOnly ? (
        <ModalHeader toggle={() => toggleFlags("game-stats")}>
          Statistics
        </ModalHeader>
      ) : (
        <ModalHeader>Game Over!</ModalHeader>
      )}
      <ModalBody>
        {!statisticsOnly && rankings && (
          <Row className="mb-2">
            <Col>
              <h3
                style={{
                  color: `rgb(${_.get(
                    playersState,
                    `details.${rankings[0].code}.color`
                  )})`
                }}
              >
                {`Winner${tie ? "s (tie):" : ":"} ${rankings[0].name}${
                  tie ? ` and ${rankings[1].name}` : ""
                }!`}
              </h3>
            </Col>
          </Row>
        )}
        <Row>
          <PlayerStats
            details={playersState.details}
            winner={
              !tie && !statisticsOnly ? _.get(rankings, "[0].code") : null
            }
          />
        </Row>
      </ModalBody>
      <ModalFooter className="justify-content-around">
        {statisticsOnly && (
          <Button
            className="btn btn-warning"
            onClick={() => {
              toggleFlags("game-over");
              toggleFlags("game-stats");
            }}
          >
            <span className="fas fa-hourglass-end fa-lg mr-2" />
            End Game
          </Button>
        )}
        <Button className="btn btn-primary" onClick={() => acceptGameOver()}>
          <span className="far fa-times-circle fa-lg mr-2" />
          Continue
        </Button>
      </ModalFooter>
    </Modal>
  );
};

GameOverModal.propTypes = {
  playersState: types.playersState.types,
  rankings: PropTypes.arrayOf(PropTypes.object),
  isOpen: PropTypes.bool,
  statisticsOnly: PropTypes.bool,
  acceptGameOver: PropTypes.func,
  toggleFlags: PropTypes.func
};

GameOverModal.defaultProps = {
  playersState: types.playersState.defaults,
  rankings: [],
  isOpen: false,
  statisticsOnly: false,
  acceptGameOver: () => {},
  toggleFlags: () => {}
};

export default GameOverModal;
