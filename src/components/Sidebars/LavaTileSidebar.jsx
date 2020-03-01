/** @module LavaTileSidebar */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ButtonBase } from "@material-ui/core";
import { Col, Row } from "reactstrap";
import _ from "lodash";

import actions from "../../redux/Actions";
import * as types from "../../types/types";

const mapStateToProps = state => {
  return {
    flagsState: state.flagsState,
    tilesState: state.tilesState
  };
};

const mapDispatchToProps = {
  toggleFlags: actions.toggleFlags
};

/**
 * @function LavaTileSidebar
 * @description Functional Presentational component for AD 79 Sidebar
 * @returns {React.Component} - Rendered component.
 */
const LavaTileSidebar = props => {
  const {
    flagsState,
    tileState,
    lavaTile,
    highlightDangerZones,
    resolveNoPlaceToPlace,
    toggleFlags
  } = props;

  const wilds = _.get(tileState, `tiles.${lavaTile}.wilds`);

  return (
    <React.Fragment>
      {flagsState.flags.includes("no-place-to-place") ? (
        <div
          data-test="sidebar-lavatile"
          className="w-100 text-center deck-container"
        >
          <h4 className="text-danger">{`No Place For ${lavaTile} To Be Placed!`}</h4>
          <figure>
            <ButtonBase
              data-test="button-continue"
              onClick={resolveNoPlaceToPlace}
            >
              <img alt={lavaTile} src={`/assets/tiles/${lavaTile}.png`} />
            </ButtonBase>
            <figcaption>(Click to Continue)</figcaption>
          </figure>
        </div>
      ) : (
        <div
          data-test="sidebar-lavatile"
          className="w-100 text-center deck-container"
        >
          <h4 className="text-danger">Wild Lava Tile Drawn (Pick Type)!</h4>
          <Row>
            <Col>
              <figure>
                <ButtonBase
                  data-test="button-lavatile"
                  onClick={() => {
                    highlightDangerZones(wilds[0]);
                    if (flagsState.flags.includes("wild-lava-tile")) {
                      toggleFlags("wild-lava-tile");
                    }
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
                    highlightDangerZones(wilds[1]);
                    if (flagsState.flags.includes("wild-lava-tile")) {
                      toggleFlags("wild-lava-tile");
                    }
                  }}
                >
                  <img alt={wilds[1]} src={`/assets/tiles/${wilds[1]}.png`} />
                </ButtonBase>
                <figcaption>{`(Click to Place ${wilds[1]})`}</figcaption>
              </figure>
            </Col>
          </Row>
        </div>
      )}
    </React.Fragment>
  );
};

LavaTileSidebar.propTypes = {
  flagsState: types.flagsState.types,
  tileState: types.tileState.types,
  lavaTile: PropTypes.string,
  resolveNoPlaceToPlace: PropTypes.func,
  highlightDangerZones: PropTypes.func,
  toggleFlags: PropTypes.func
};

LavaTileSidebar.defaultProps = {
  tileState: types.tileState.defaults,
  flagsState: types.flagsState.defaults,
  lavaTile: "",
  resolveNoPlaceToPlace: () => {},
  highlightDangerZones: () => {},
  toggleFlags: () => {}
};

export const LavaTileSideBarTest = LavaTileSidebar;
export default connect(mapStateToProps, mapDispatchToProps)(LavaTileSidebar);
