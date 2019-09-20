import DedupeReducer from './DedupeReducer';
import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';

const rootReducer = combineReducers({
  DedupeReducer: DedupeReducer
});

export default rootReducer;
