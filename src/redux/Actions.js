/** @module Actions */

import * as cardsActions from "./Actions/CardsActions";
import * as flagsActions from "./Actions/FlagsActions";
import * as gamePlayActions from "./Actions/GamePlayActions";
import * as gridActions from "./Actions/GridActions";
import * as messageActions from "./Actions/MessageActions";
import * as playersActions from "./Actions/PlayersActions";
import * as snackBarActions from "./Actions/SnackbarActions";
import * as tileActions from "./Actions/TilesActions";

const actions = {
  ...cardsActions,
  ...flagsActions,
  ...gamePlayActions,
  ...gridActions,
  ...messageActions,
  ...playersActions,
  ...snackBarActions,
  ...tileActions
};

export default actions;
