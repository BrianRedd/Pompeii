/** @module OmenSidebar */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";

/**
 * @function OmenSidebar
 * @description Functional Presentational component for Omen Sidebar
 * @returns {React.Component} - Rendered component.
 */
const OmenSidebar = props => {
  const { name, setOmenFlag, sacrificeMessage, setSacrificeMessage } = props;
  return (
    <div data-test="sidebar-omen" className="w-100 text-center">
      <h4>Omen!</h4>
      <figure>
        <ButtonBase
          data-test="button-omen"
          onClick={() => {
            setOmenFlag(false);
            setSacrificeMessage("");
          }}
        >
          <img
            alt="Omen"
            src="/assets/cards/Omen-0-S.png"
            className="pompeii-card"
          />
        </ButtonBase>
        <figcaption data-test="caption">
          {sacrificeMessage
            ? `${sacrificeMessage}`
            : `${name}, choose a person to SACRIFICE to the Gods!`}
        </figcaption>
      </figure>
    </div>
  );
};

OmenSidebar.propTypes = {
  name: PropTypes.string,
  sacrificeMessage: PropTypes.string,
  setOmenFlag: PropTypes.func,
  setSacrificeMessage: PropTypes.func
};

OmenSidebar.defaultProps = {
  name: "",
  sacrificeMessage: "",
  setOmenFlag: () => {},
  setSacrificeMessage: () => {}
};

export default OmenSidebar;
