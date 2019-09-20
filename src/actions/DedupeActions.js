import { AFTER_MERGE_SAVE, SELECTED_ROW_DATA, SHOW_MODAL } from '.';

let actions = {
  setShowModal: value => ({
    type: SHOW_MODAL,
    data: value
  }),
  setSelectedRowsData: rows => ({
    type: SELECTED_ROW_DATA,
    data: rows
  }),
  afterMergeSave: finalData => ({
    type: AFTER_MERGE_SAVE,
    data: finalData
  })
};

export default actions;
