/** @module AD79Sidebar */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";

import * as types from "../../types/types";
import { stageData } from "../../data/messageData";

/**
 * @function AD79Sidebar
 * @description Functional Presentational component for AD 79 Sidebar
 * @returns {React.Component} - Rendered component.
 */
const AD79Sidebar = props => {
  const { messageState, setAD79Flag } = props;
  return (
    <div data-test="sidebar-ad79" className="w-100 text-center">
      <h4 className={`text-${stageData[messageState.stage + 1].color}`}>
        {stageData[messageState.stage + 1].text}
      </h4>
      <figure>
        <ButtonBase data-test="button-ad79" onClick={() => setAD79Flag(false)}>
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
  messageState: types.messageState.types,
  setAD79Flag: PropTypes.func
};

AD79Sidebar.defaultProps = {
  messageState: types.messageState.defaults,
  setAD79Flag: () => {}
};

export default AD79Sidebar;
