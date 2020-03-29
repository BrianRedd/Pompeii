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
import { IconButton, Button, ButtonBase, Tooltip } from "@material-ui/core";

import { aiPlayers } from "../../data/playerData";

import "./styles/modals.scss";

/**
 * @function HumanOrAI
 * @description React component to return Human/AI icon
 * @param {Object} formProps
 * @param {String} name
 * @returns {React.Component}
 */
const HumanOrAI = ({ formProps, name }) => {
  return (
    <Col xs={2}>
      <ButtonBase
        className="form-control"
        onClick={() => {
          formProps.setFieldValue(`${name}AI`, !formProps.values[`${name}AI`]);
          formProps.setFieldValue(name, "");
        }}
      >
        {formProps.values[`${name}AI`] ? (
          <i className="fas fa-robot" />
        ) : (
          <i className="fas fa-user" />
        )}
      </ButtonBase>
    </Col>
  );
};

HumanOrAI.propTypes = {
  formProps: PropTypes.shape({
    values: PropTypes.object,
    setFieldValue: PropTypes.func
  }),
  name: PropTypes.string
};

HumanOrAI.defaultProps = {
  formProps: {
    values: {},
    setFieldValue: () => {}
  },
  name: ""
};

/**
 * @function AIDropDown
 * @description React component to return AI drop down options
 * @param {Object} formProps
 * @param {String} name
 * @returns {React.Component}
 */
const AIDropDown = ({ formProps, name }) => {
  const currentPlayers = Object.values(formProps.values).map(value => value);
  const aiDropDown = Object.keys(aiPlayers).map(ai => {
    return (
      <option
        key={ai}
        value={ai}
        className={currentPlayers.includes(ai) ? "d-none" : ""}
      >
        {ai}
      </option>
    );
  });
  return (
    <Field
      data-test="field-ai-drop-down"
      required
      as="select"
      name={name}
      className="form-control"
      value={formProps.values[name]}
      onChange={e => {
        formProps.setFieldValue(name, e.target.value);
      }}
    >
      <option value=""> </option>
      {aiDropDown}
    </Field>
  );
};

AIDropDown.propTypes = {
  formProps: PropTypes.shape({
    values: PropTypes.object,
    setFieldValue: PropTypes.func
  }),
  name: PropTypes.string
};

AIDropDown.defaultProps = {
  formProps: {
    values: {},
    setFieldValue: () => {}
  },
  name: ""
};

/**
 * @function PlayerNameSelection
 * @description React component to return player selection
 * @param {Object} formProps
 * @returns {React.Component}
 */
const PlayerNameSelection = ({ formProps }) => {
  const playerNameSelection = [];
  for (let i = 1; i <= formProps.values.numberOfPlayers; i += 1) {
    playerNameSelection.push(
      <Row className="form-group" key={i}>
        <Label xs={5}>{`Player ${i} Name:`}</Label>
        <Col xs={5}>
          {formProps.values[`player${i}AI`] ? (
            <AIDropDown formProps={formProps} name={`player${i}`} />
          ) : (
            <Field
              data-test="field-name"
              required
              name={`player${i}`}
              className="form-control"
            />
          )}
        </Col>
        <HumanOrAI formProps={formProps} name={`player${i}`} />
      </Row>
    );
  }
  return playerNameSelection;
};

/**
 * @function StartGameModal
 * @description Functional Presentational component for Game Over Modal
 * @returns {React.Component} - Rendered component.
 */
const StartGameModal = props => {
  const { flags, commitStartGame, initialValues } = props;

  const startGame = "game-start";

  return (
    <Modal data-test="modal-game-start" isOpen={flags.includes(startGame)}>
      <ModalHeader>Start Game</ModalHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={values => commitStartGame(values)}
      >
        {formProps => (
          <Form>
            <ModalBody>
              <Col xs={12}>
                <Row className="form-group">
                  <Label xs={5}>Number of Players:</Label>
                  <Col xs={7}>
                    <Field
                      as="select"
                      name="numberOfPlayers"
                      className="form-control"
                    >
                      <option value={2}>Two (2)</option>
                      <option value={3}>Three (3)</option>
                      <option value={4}>Four (4)</option>
                    </Field>
                  </Col>
                </Row>
              </Col>
              <hr />
              <Col xs={12}>
                <PlayerNameSelection formProps={formProps} />
              </Col>
              <hr />
              <Col xs={12}>
                <Row className="form-group">
                  <Label xs={5}>Starting Player:</Label>
                  <Col xs={7}>
                    <Field
                      as="select"
                      name="startPlayer"
                      className="form-control"
                    >
                      <option value={0}>Random</option>
                      <option value={1}>{formProps.values.player1}</option>
                      <option value={2}>{formProps.values.player2}</option>
                      {formProps.values.numberOfPlayers > 2 && (
                        <option value={3}>{formProps.values.player3}</option>
                      )}
                      {formProps.values.numberOfPlayers > 3 && (
                        <option value={4}>{formProps.values.player4}</option>
                      )}
                    </Field>
                  </Col>
                </Row>
              </Col>
              <hr />
              <Col xs={12}>
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
                        onClick={() => {
                          const nextPhase =
                            (formProps.values.startPhase + 1) % 3;
                          formProps.setFieldValue("startPhase", nextPhase);
                          formProps.setFieldValue(
                            "prePopulate",
                            !!(nextPhase > 0)
                          );
                        }}
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
                  <Tooltip title="Dev Mode: Terror Delay">
                    <div>
                      <IconButton
                        onClick={() =>
                          formProps.setFieldValue(
                            "noEruption",
                            !formProps.values.noEruption
                          )
                        }
                        disabled={formProps.values.startPhase !== 2}
                      >
                        {formProps.values.noEruption ||
                        formProps.values.startPhase !== 2 ? (
                          <i className="fas fa-exclamation-triangle fa-sm color-grey" />
                        ) : (
                          <i className="fas fa-exclamation-triangle fa-sm color-magenta" />
                        )}
                      </IconButton>
                    </div>
                  </Tooltip>
                </Row>
              </Col>
            </ModalBody>
            <ModalFooter className="justify-content-center">
              <Button
                data-test="button-submit"
                className="btn btn-primary"
                type="submit"
              >
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
