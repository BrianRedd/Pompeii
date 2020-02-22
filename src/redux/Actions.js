/** @module Actions */

import * as cardsActions from "./Actions/CardsActions";
import * as gridActions from "./Actions/GridActions";
import * as messageActions from "./Actions/MessageActions";
import * as playersActions from "./Actions/PlayersActions";
import * as startupActions from "./Actions/StartupActions";

const actions = {
  ...cardsActions,
  ...gridActions,
  ...messageActions,
  ...playersActions,
  ...startupActions
};

export default actions;
