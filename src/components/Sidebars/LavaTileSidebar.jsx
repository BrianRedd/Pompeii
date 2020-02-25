/** @module LavaTileSidebar */

import React from "react";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";
import { Col, Row } from "reactstrap";
import _ from "lodash";

import * as types from "../../types/types";

/**
 * @function LavaTileSidebar
 * @description Functional Presentational component for AD 79 Sidebar
 * @returns {React.Component} - Rendered component.
 */
const LavaTileSidebar = props => {
  const { lavaTile, highlightDangerZones, tileState } = props;

  const wilds = _.get(tileState, `tiles.${lavaTile}.wilds`);

  return (
    <React.Fragment>
      {wilds ? (
        <div
          data-test="sidebar-lavatile"
          className="w-100 text-center deck-container"
        >
          <h4 className="text-danger">Wild Lava Tile Drawn!</h4>
          <Row>
            <Col>
              <figure>
                <ButtonBase
                  data-test="button-lavatile"
                  onClick={() => {
                    console.log(wilds[0]);
                    highlightDangerZones(wilds[0]);
                  }}
                >
                  <img alt={wilds[0]} src={`/assets/tiles/${wilds[0]}.png`} />
                </ButtonBase>
                <figcaption>{`(Click to Place ${wilds[0]})`}</figcaption>
              </figure>
            </Col>
            <Col>
              <figure>
                <ButtonBase
                  data-test="button-lavatile"
                  onClick={() => {
                    console.log(wilds[1]);
                    highlightDangerZones(wilds[1]);
                  }}
                >
                  <img alt={wilds[1]} src={`/assets/tiles/${wilds[1]}.png`} />
                </ButtonBase>
                <figcaption>{`(Click to Place ${wilds[1]})`}</figcaption>
              </figure>
            </Col>
          </Row>
        </div>
      ) : (
        <div
          data-test="sidebar-lavatile"
          className="w-100 text-center deck-container"
        >
          <h4 className="text-danger">{`Lava Tile for ${lavaTile} Drawn!`}</h4>
          <figure>
            <ButtonBase
              data-test="button-lavatile"
              onClick={() => highlightDangerZones(lavaTile)}
            >
              <img alt={lavaTile} src={`/assets/tiles/${lavaTile}.png`} />
            </ButtonBase>
            <figcaption>(Click to Place)</figcaption>
          </figure>
        </div>
      )}
    </React.Fragment>
  );
};

LavaTileSidebar.propTypes = {
  tileState: types.tileState.types,
  lavaTile: PropTypes.string,
  highlightDangerZones: PropTypes.func
};

LavaTileSidebar.defaultProps = {
  tileState: types.tileState.defaults,
  lavaTile: "",
  highlightDangerZones: () => {}
};

export default LavaTileSidebar;
