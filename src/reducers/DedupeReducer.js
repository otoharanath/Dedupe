import { AFTER_MERGE_SAVE, SELECTED_ROW_DATA, SHOW_MODAL } from '../actions';

const InitialState = {
  showDedupe: false,
  rows: [],
  finalData: {}
};

let DedupeReducer = function(state = InitialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return Object.assign({}, state, { showDedupe: action.data });

    case SELECTED_ROW_DATA:
      return Object.assign({}, state, { rows: action.data });

    case AFTER_MERGE_SAVE:
      return Object.assign({}, state, { finalData: action.data });

    default:
      return state;
  }
};

export default DedupeReducer;
