/** @module AnimatedPieceLayer */

import React, { useState, useEffect } from "react";
import { ButtonBase } from "@material-ui/core";
import _ from "lodash";

import * as types from "../../types/types";
import * as constant from "../../data/constants";

import { runToSquare } from "../Logic/runnerLogic";

const AnimatedPieceLayer = ({
  gamePlayState: { selectedPerson },
  playersState: { details }
}) => {
  const [left, setLeft] = useState();
  const [top, setTop] = useState();

  useEffect(() => {
    console.log("square:", selectedPerson.square);
    const coords = selectedPerson.square.split("_");
    setLeft(`${parseFloat(coords[1] * 110) + constant.X_OFFSET + 35}px`);
    setTop(`${parseFloat(coords[0] * 110) + constant.Y_OFFSET + 35}px`);
  }, [selectedPerson.square]);

  return (
    <ButtonBase
      className={`person ${selectedPerson.id} animated-piece`}
      style={{
        left,
        top,
        backgroundColor: `rgb(${_.get(
          details,
          `${selectedPerson.player}.color`
        )})`
      }}
      onClick={() => {
        runToSquare(selectedPerson.square);
      }}
    >
      <span className={`fas fa-${selectedPerson.gender} fa-lg`} />
    </ButtonBase>
  );
};

AnimatedPieceLayer.propTypes = {
  gamePlayState: types.gamePlayState.types,
  playersState: types.playersState.types
};

AnimatedPieceLayer.defaultProps = {
  gamePlayState: types.gamePlayState.defaults,
  playersState: types.playersState.defaults
};

export default AnimatedPieceLayer;
