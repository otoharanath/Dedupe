import { 
  OJ_OPTION_DATA,
  OJ_TRANSACTION_ID,
  OJ_DETAILS
} from '../actions';

const InitialState = {
  optionData:{},
  transactionId: {},
  details: {}
};

let OtoJobsReducer = function (state = InitialState, action) {
  switch (action.type) {
    case OJ_OPTION_DATA:
      return Object.assign({}, state, { optionData: action.optionData });

      case OJ_TRANSACTION_ID:
      return Object.assign({}, state, { transactionId: action.transactionId });

      case OJ_DETAILS:
      return Object.assign({}, state, { details: action.details });

    default:
      return state;
  }
};

export default OtoJobsReducer;
