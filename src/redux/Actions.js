/** @module Actions */

import * as cardsActions from "./Actions/CardsActions";
import * as gridActions from "./Actions/GridActions";
import * as playersActions from "./Actions/PlayersActions";
import * as startupActions from "./Actions/StartupActions";

const actions = {
  ...cardsActions,
  ...gridActions,
  ...playersActions,
  ...startupActions
};

export default actions;
