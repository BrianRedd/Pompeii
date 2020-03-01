/** @module Actions */

import * as cardsActions from "./Actions/CardsActions";
import * as flagsActions from "./Actions/FlagsActions";
import * as gridActions from "./Actions/GridActions";
import * as messageActions from "./Actions/MessageActions";
import * as playersActions from "./Actions/PlayersActions";
import * as startupActions from "./Actions/StartupActions";
import * as tileActions from "./Actions/TilesActions";

const actions = {
  ...cardsActions,
  ...flagsActions,
  ...gridActions,
  ...messageActions,
  ...playersActions,
  ...startupActions,
  ...tileActions
};

export default actions;
