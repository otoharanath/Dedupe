import DedupeReducer from './DedupeReducer';
import OtoJobsReducer from './OtoJobsReducer';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth_reducer';


//import { reducer as toastrReducer } from 'react-redux-toastr';


const rootReducer = combineReducers({
  DedupeReducer: DedupeReducer,
  OtoJobsReducer:OtoJobsReducer,
  form: formReducer,
  auth: authReducer


});

export default rootReducer;
