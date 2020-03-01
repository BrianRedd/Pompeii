/** @module SnackbarNotifier */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import _ from "lodash";

import actions from "../../redux/Actions";
import * as types from "../../types/types";

const mapStateToProps = state => {
  return {
    snackbarState: state.snackbarState
  };
};

const mapDispatchToProps = {
  addSnackbar: actions.addSnackbar
};

/**
 * @function SnackbarNotifier
 * @description Functional Presentational component for Snackbar Notifier
 * Temporarily displays snackbar message unobtrusively in lower left-hand corner when message should be
 * communicated to user (action success, etc)
 * @returns {React.Component} - Rendered component.
 */
const SnackbarNotifier = props => {
  const { enqueueSnackbar, snackbarState, addSnackbar } = props;

  useEffect(() => {
    if (_.get(snackbarState, "message")) {
      enqueueSnackbar(snackbarState.message, {
        variant: `${snackbarState.type}`,
        className: `custom-snackbar ${snackbarState.type}`
      });
      addSnackbar({ message: null });
    }
  }, [snackbarState, enqueueSnackbar, addSnackbar]);

  return <span data-test="common-snackbar-notifier" />;
};

SnackbarNotifier.propTypes = {
  snackbarState: types.snackbarState.types,
  addSnackbar: PropTypes.func,
  enqueueSnackbar: PropTypes.func
};

SnackbarNotifier.defaultProps = {
  snackbarState: types.snackbarState.defaults,
  addSnackbar: () => {},
  enqueueSnackbar: () => {}
};

export const SnackbarNotifierTest = SnackbarNotifier;
export default withSnackbar(
  connect(mapStateToProps, mapDispatchToProps)(SnackbarNotifier)
);
