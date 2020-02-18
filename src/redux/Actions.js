/** @module Actions */

import * as cardsActions from "./Actions/CardsActions";
import * as playersActions from "./Actions/PlayersActions";
import * as startupActions from "./Actions/StartupActions";

const actions = {
  ...cardsActions,
  ...playersActions,
  ...startupActions
};

export default actions;
