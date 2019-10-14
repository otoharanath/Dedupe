import { 
  OJ_OPTION_DATA
} from '../actions';

const InitialState = {
  optionData:{}
};

let OtoJobsReducer = function (state = InitialState, action) {
  switch (action.type) {
    case OJ_OPTION_DATA:
      return Object.assign({}, state, { optionData: action.optionData });

    default:
      return state;
  }
};

export default OtoJobsReducer;
