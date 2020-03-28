/** @module Actions */

import * as cardsActions from "./Actions/CardsActions";
import * as flagsActions from "./Actions/FlagsActions";
import * as gridActions from "./Actions/GridActions";
import * as messageActions from "./Actions/MessageActions";
import * as playersActions from "./Actions/PlayersActions";
import * as snackBarActions from "./Actions/SnackbarActions";
import * as gamePlayActions from "./Actions/GamePlayActions";
import * as tileActions from "./Actions/TilesActions";

const actions = {
  ...cardsActions,
  ...flagsActions,
  ...gridActions,
  ...messageActions,
  ...playersActions,
  ...snackBarActions,
  ...gamePlayActions,
  ...tileActions
};

export default actions;
