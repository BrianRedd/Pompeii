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

import * as types from "../../types/types";

import "./styles/gameover.scss";

const PlayerStats = ({ details }) => {
  const detailsArray = Object.keys(details);
  const playersStats = detailsArray.map(player => {
    return (
      <Col xs={12 / detailsArray.length} key={player}>
        <h5 style={{ color: `rgb(${details[player].color})` }}>
          {details[player].name}
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
  const { playersState, flags, acceptGameOver } = props;

  const GameOver = "game-over";

  return (
    <Modal
      data-test="modal-game-over"
      isOpen={flags.includes(GameOver)}
      className="modal-lg"
    >
      <ModalHeader>Game Over!</ModalHeader>
      <ModalBody>
        <Row>
          <PlayerStats details={playersState.details} />
        </Row>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <Button className="btn btn-info" onClick={() => acceptGameOver()}>
          <span className="far fa-times-circle fa-lg mr-2" />
          Continue
        </Button>
      </ModalFooter>
    </Modal>
  );
};

GameOverModal.propTypes = {
  playersState: types.playersState.types,
  flags: PropTypes.arrayOf(PropTypes.string),
  acceptGameOver: PropTypes.func
};

GameOverModal.defaultProps = {
  playersState: types.playersState.defaults,
  flags: [],
  acceptGameOver: () => {}
};

export default GameOverModal;
