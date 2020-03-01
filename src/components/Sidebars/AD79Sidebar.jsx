/** @module AD79Sidebar */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";

import actions from "../../redux/Actions";
import * as types from "../../types/types";
import { stageData } from "../../data/messageData";

const mapStateToProps = state => {
  return {
    flagsState: state.flagsState,
    messageState: state.messageState
  };
};

const mapDispatchToProps = {
  toggleFlags: actions.toggleFlags
};

/**
 * @function AD79Sidebar
 * @description Functional Presentational component for AD 79 Sidebar
 * @returns {React.Component} - Rendered component.
 */
const AD79Sidebar = props => {
  const { messageState, flagsState, toggleFlags } = props;
  return (
    <div data-test="sidebar-ad79" className="w-100 text-center">
      <h4 className={`text-${stageData[messageState.stage].color}`}>
        {stageData[messageState.stage].text}
      </h4>
      <figure>
        <ButtonBase
          data-test="button-ad79"
          onClick={() => {
            if (flagsState.flags.includes("card-ad79")) {
              toggleFlags("card-ad79");
            }
          }}
        >
          <img
            alt="AD 79"
            src="/assets/cards/AD79-0-S.png"
            className="pompeii-card"
          />
        </ButtonBase>
        <figcaption>(Click to Continue)</figcaption>
      </figure>
    </div>
  );
};

AD79Sidebar.propTypes = {
  flagsState: types.flagsState.types,
  messageState: types.messageState.types,
  toggleFlags: PropTypes.func
};

AD79Sidebar.defaultProps = {
  flagsState: types.flagsState.defaults,
  messageState: types.messageState.defaults,
  toggleFlags: () => {}
};

export const AD79SidebarTest = AD79Sidebar;
export default connect(mapStateToProps, mapDispatchToProps)(AD79Sidebar);
