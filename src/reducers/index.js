import DedupeReducer from './DedupeReducer';
import OtoJobsReducer from './OtoJobsReducer';
import { combineReducers } from 'redux';
//import { reducer as toastrReducer } from 'react-redux-toastr';


const rootReducer = combineReducers({
  DedupeReducer: DedupeReducer,
  OtoJobsReducer:OtoJobsReducer
});

export default rootReducer;
