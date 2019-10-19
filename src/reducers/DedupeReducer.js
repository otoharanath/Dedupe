import { AFTER_MERGE_SAVE,
  SELECTED_ROW_DATA,
  SHOW_MODAL,
  GLOBAL_RESPONSE,
  FETCH_TABLE_DATA,
  FETCH_TABLE_DATA_PERCENTAGE,
  INITIAL_TRANSACTION,
  CURRENT_VERSION,
  SHOW_SELECT_MODAL,
  IS_AUTH
} from '../actions';

const InitialState = {
  showDedupe: false,
  rows: [],
  finalData: {},
  inputResponse: {},
  responseData: {},
  initialTransaction: {},
  currentVersion:{},
  active:{},
  isAuth:false
};

let DedupeReducer = function (state = InitialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return Object.assign({}, state, { showDedupe: action.data });

      case SHOW_SELECT_MODAL:
        return Object.assign({}, state, { showSelect: action.data });

    case SELECTED_ROW_DATA:
      return Object.assign({}, state, { rows: action.data });

    case AFTER_MERGE_SAVE:
      return Object.assign({}, state, { finalData: action.data });

      case IS_AUTH:
        return Object.assign({}, state, { isAuth: action.data });

    case GLOBAL_RESPONSE:
      return Object.assign({}, state, { inputResponse: action.data });

      case INITIAL_TRANSACTION:
        return Object.assign({}, state, { initialTransaction: action.initialTransaction });
  
      case CURRENT_VERSION:
        return Object.assign({}, state, { currentVersion: action.currentVersion });

    case FETCH_TABLE_DATA:
      return Object.assign({}, state, { dedupeData: action.dedupeData });

    case FETCH_TABLE_DATA_PERCENTAGE:
      return Object.assign({}, state, { percentage: action.percentage || 5 });
    default:
      return state;
  }
};

export default DedupeReducer;
