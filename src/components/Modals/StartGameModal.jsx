/** @module StartGameModal */

import React from "react";
import PropTypes from "prop-types";
import {
  Col,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import { IconButton, Button, Tooltip } from "@material-ui/core";

import "./styles/modals.scss";

/**
 * @function StartGameModal
 * @description Functional Presentational component for Game Over Modal
 * @returns {React.Component} - Rendered component.
 */
const StartGameModal = props => {
  const { flags, commitStartGame, initialValues } = props;

  const StartGame = "game-start";

  return (
    <Modal data-test="modal-game-start" isOpen={flags.includes(StartGame)}>
      <ModalHeader>Start Game</ModalHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={values => commitStartGame(values)}
      >
        {formProps => (
          <Form>
            <ModalBody>
              <Col>
                <Row className="form-group">
                  <Label xs={6}>Number of Players:</Label>
                  <Col xs={6}>
                    <Field
                      as="select"
                      name="numberOfPlayers"
                      className="form-control"
                    >
                      <option value={2}>Two</option>
                      <option value={3}>Three</option>
                      <option value={4}>Four</option>
                    </Field>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Label xs={6}>Player 1 Name:</Label>
                  <Col xs={6}>
                    <Field name="player1" className="form-control" />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Label xs={6}>Player 2 Name:</Label>
                  <Col xs={6}>
                    <Field name="player2" className="form-control" />
                  </Col>
                </Row>
                {formProps.values.numberOfPlayers > 2 && (
                  <Row className="form-group">
                    <Label xs={6}>Player 3 Name:</Label>
                    <Col xs={6}>
                      <Field name="player3" className="form-control" />
                    </Col>
                  </Row>
                )}
                {formProps.values.numberOfPlayers > 3 && (
                  <Row className="form-group">
                    <Label xs={6}>Player 4 Name:</Label>
                    <Col xs={6}>
                      <Field name="player4" className="form-control" />
                    </Col>
                  </Row>
                )}
                <Row className="justify-content-end">
                  <Tooltip title="Dev Mode: Pre-populate Board">
                    <div>
                      <IconButton
                        onClick={() =>
                          formProps.setFieldValue(
                            "prePopulate",
                            !formProps.values.prePopulate
                          )
                        }
                      >
                        {formProps.values.prePopulate ? (
                          <i className="fas fa-users fa-sm color-magenta" />
                        ) : (
                          <i className="fas fa-users fa-sm color-grey" />
                        )}
                      </IconButton>
                    </div>
                  </Tooltip>
                  <Tooltip
                    title={`Dev Mode: Phase ${formProps.values.startPhase}`}
                  >
                    <div>
                      <IconButton
                        onClick={() =>
                          formProps.setFieldValue(
                            "startPhase",
                            (formProps.values.startPhase + 1) % 3
                          )
                        }
                      >
                        {(() => {
                          switch (formProps.values.startPhase) {
                            case 1:
                              return (
                                <i className="fa-sm fas fa-dice-two color-blue" />
                              );
                            case 2:
                              return (
                                <i className="fa-sm fas fa-dice-three color-magenta" />
                              );
                            default:
                              return (
                                <i className="fa-sm fas fa-dice-one color-grey" />
                              );
                          }
                        })()}
                      </IconButton>
                    </div>
                  </Tooltip>
                </Row>
              </Col>
            </ModalBody>
            <ModalFooter className="justify-content-center">
              <Button className="btn btn-primary" type="submit">
                <span className="far fa-times-circle fa-lg mr-2" />
                Continue
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

StartGameModal.propTypes = {
  flags: PropTypes.arrayOf(PropTypes.string),
  initialValues: PropTypes.shape({
    key: PropTypes.any
  }),
  commitStartGame: PropTypes.func
};

StartGameModal.defaultProps = {
  flags: [],
  initialValues: {
    numberOfPlayers: 3,
    player1: "Player 1",
    player2: "Player 2",
    player3: "Player 3"
  },
  commitStartGame: () => {}
};

export default StartGameModal;
