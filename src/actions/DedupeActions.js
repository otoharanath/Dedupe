import {
  AFTER_MERGE_SAVE,
  SELECTED_ROW_DATA,
  SHOW_MODAL,
  GLOBAL_RESPONSE,
  FETCH_TABLE_DATA,
  FETCH_TABLE_DATA_PERCENTAGE,
  INITIAL_TRANSACTION,
  CURRENT_VERSION,
  SHOW_SELECT_MODAL,
  IS_AUTH,
  DEDUPE_COLUMNS,
  D_RECENT_TRANS,
  TRAN_VERSION
} from '.';
const token = localStorage.getItem('user');
let actions = {
  setShowModal: value => ({
    type: SHOW_MODAL,
    data: value
  }),
  setShowSelectModal: value => ({
    type: SHOW_SELECT_MODAL,
    data: value
  }),
  setSelectedRowsData: rows => ({
    type: SELECTED_ROW_DATA,
    data: rows
  }),
  afterMergeSave: finalData => ({
    type: AFTER_MERGE_SAVE,
    data: finalData
  }),
  isAuth: auth => ({
    type: IS_AUTH,
    data: auth
  }),
  globalResponse: data => ({
    type: GLOBAL_RESPONSE,
    data: data
  }),
  dedupeColumns: data => ({
    type: DEDUPE_COLUMNS,
    data: data
  }),
  postTransaction: (body) => {
    return function (dispatch) {

      fetch('https://otobots.otomashen.com:6969/dedupe/postTransaction', {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + token,
      }),
        body
      })
        .then((data) => (data.json()))      
        .then((data) => {

          dispatch({
            type: INITIAL_TRANSACTION,
            initialTransaction: (
              data
            )
          })
          getTransactionState(data, dispatch);

        })
       
        
    };
  },

  postTransactionExactMatch: (body) => {
    return function (dispatch) {

      fetch('https://otobots.otomashen.com:6969/dedupe/postTransactionExact', {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + token,
      }),
        body
      })
        .then((data) => (data.json()))      
        .then((data) => {

          dispatch({
            type: INITIAL_TRANSACTION,
            initialTransaction: (
              data
            )
          })
          getTransactionState(data, dispatch);

        })
       
        
    };
  },

  getTransactionVersions : (data) => {
    return function (dispatch) {
    const fd = new FormData();
    fd.append('transactionId', data.transactionId)
    fd.append('version', data.version)
    fetch('https://otobots.otomashen.com:6969/dedupe/getTransactionState', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + token,
    }),
      body: fd
    }).then((response) => response.json())
     .then((response) => {
          dispatch({
            type: TRAN_VERSION,
            dedupeData: 
              response.message &&
              response.message.dedupeData
          })
        }
     )
    }
  },
  
  getTransactionStateUndoRedo : (data) => {
    return function (dispatch) {
    const fd = new FormData();
    fd.append('transactionId', data.transactionId)
    fd.append('version', data.version)
    fetch('https://otobots.otomashen.com:6969/dedupe/getTransactionState', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + token,
    }),
      body: fd
    }).then((response) => response.json())
     .then((response) => {
         const currentIndex = (
          response.message &&
          response.message.dedupeFunction &&
          response.message.dedupeFunction[0] &&
          response.message.dedupeFunction[0].currentIndex || 0
        )
        const numberOfRecords = response.message && response.message.numberOfRecords || 1
   
        if (!(response.message && response.message.hasOwnProperty('completed') && response.message.completed)) {
          // Call API again if transaction is not completed after 1 sec of API response.
          setTimeout(() => {
            getTransactionState(data, dispatch);
          }, 200)
  
        } else {
          dispatch({
            type: FETCH_TABLE_DATA,
            dedupeData: (
              response.message &&
              response.message.dedupeData &&
              response.message.dedupeData[data.version] &&
              response.message.dedupeData[data.version].dedupeJson ||
              []
            )
          })
          dispatch({
            type: INITIAL_TRANSACTION,
                initialTransaction: (
                  data
                )
          })
  
        }
  
         dispatch({
          type: FETCH_TABLE_DATA_PERCENTAGE,
          percentage: (
            currentIndex / numberOfRecords
          ) * 100
        }); 
      })
    }
    },

    dedupeRecentTransactions: () => {
      return function (dispatch) {
          const fd = new FormData();
          fd.append('customerId', localStorage.getItem('customerId'))
          fetch('https://otobots.otomashen.com:6969/transaction/getAllDedupeTransactions', {
              method: 'POST',
              headers: new Headers({
                  'Authorization': 'Bearer ' + token,
              }),
              body: fd
          })
              .then((data) => (data.json()))
              .then((data) => {
                  dispatch({
                      type: D_RECENT_TRANS,
                      recentTrans: (
                          data
                      )
                  })
              })
      };
  },

 
updateTransaction: (body, tid) => {
  
  return function (dispatch) {
    let form = new FormData();
    form.append('transactionId', tid.transactionId);
    form.append('action', body);
    form.append('version', tid.version);
   // console.log("form",form)
     //console.log("form",form)

    fetch('https://otobots.otomashen.com:6969/dedupe/updateTransactionState', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + token,
    }),
      body: form
    })
      .then((data) => (data.json()))
      .then((data) =>{
        console.log("response", data)
      dispatch({
        type: INITIAL_TRANSACTION,
            initialTransaction: (
              data
            )
      })
      dispatch({
        type: CURRENT_VERSION,
            currentVersion: (
              data
            )
      })
     getTransactionState(data, dispatch)
    }
      )
     
  };
}
};



export const getTransactionState = (data, dispatch) => {
  const fd = new FormData();
  fd.append('transactionId', data.transactionId)
  fd.append('version', data.version)
  fetch('https://otobots.otomashen.com:6969/dedupe/getTransactionState', {
    method: 'POST',
    headers: new Headers({
      'Authorization': 'Bearer ' + token,
  }),
    body: fd
  }).then((response) => response.json())
   .then((response) => {
       const currentIndex = (
        response.message &&
        response.message.dedupeFunction &&
        response.message.dedupeFunction[0] &&
        response.message.dedupeFunction[0].currentIndex || 0
      )
      const numberOfRecords = response.message && response.message.numberOfRecords || 1
 
      if (!(response.message && response.message.hasOwnProperty('completed') && response.message.completed)) {
        // Call API again if transaction is not completed after 1 sec of API response.
        setTimeout(() => {
          getTransactionState(data, dispatch);
        }, 1000)

      } else {
        dispatch({
          type: FETCH_TABLE_DATA,
          dedupeData: (
            response.message &&
            response.message.dedupeData &&
            response.message.dedupeData[data.version] &&
            response.message.dedupeData[data.version].dedupeJson ||
            []
          )
        })

      }

       dispatch({
        type: FETCH_TABLE_DATA_PERCENTAGE,
        percentage: (
          currentIndex / numberOfRecords
        ) * 100
      }); 

    })

}
export default actions;
