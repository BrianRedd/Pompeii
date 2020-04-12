/** @module InstructionsModal */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "@material-ui/core";

import actions from "../../redux/Actions";
import * as types from "../../types/types";

import "./styles/modals.scss";

const mapStateToProps = state => {
  return {
    flagsState: state.flagsState
  };
};

const mapDispatchToProps = {
  toggleFlags: actions.toggleFlags
};

const InstructionsModal = props => {
  const {
    flagsState: { flags },
    toggleFlags
  } = props;

  return (
    <Modal
      data-test="modal-game-rules"
      isOpen={flags.includes("rules-modal")}
      className="modal-xl"
    >
      <ModalHeader toggle={() => toggleFlags("rules-modal")}>
        <span className="fas fa-book-open mr-2" />
        Game Rules
      </ModalHeader>
      <ModalBody>Instructions</ModalBody>
      <ModalFooter className="d-flex justify-content-end">
        <Button
          data-test="button-close"
          className="btn btn-primary"
          onClick={() => toggleFlags("rules-modal")}
        >
          <span className="far fa-times-circle fa-lg mr-2" />
          Continue
        </Button>
      </ModalFooter>
    </Modal>
  );
};

InstructionsModal.propTypes = {
  flagsState: types.flagsState.types,
  toggleFlags: PropTypes.func
};

InstructionsModal.defaultProps = {
  flagsState: types.flagsState.defaults,
  toggleFlags: () => {}
};

export const InstructionsModalTest = InstructionsModal;
export default connect(mapStateToProps, mapDispatchToProps)(InstructionsModal);
