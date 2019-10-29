import {
    OJ_OPTION_DATA,
    OJ_TRANSACTION_ID,
    OJ_DETAILS,
    OJ_RECENT_TRANS
} from '.';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhcmlrc2hpdHNoYXJtYTcwQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmQiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE1NzExMDQxODcsImV4cCI6MTU3MTEwNzc4N30.shNUTktPpeE8O2e8wiPGujpyoID-pjxkvNbZRXRgpVs'
let actions = {

    getOptionData: () => {
        return function (dispatch) {

            fetch('https://otobots.otomashen.com:6969/transaction/getMetaData', {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                })
            })
                .then((data) => (data.json()))
                .then((data) => {
                    dispatch({
                        type: OJ_OPTION_DATA,
                        optionData: (
                            data
                        )
                    })
                })
        };
    },
    otojobsRecentTransactions: (customerId) => {
        return function (dispatch) {
            const fd = new FormData();
            fd.append('customerId', customerId)
            fetch('https://otobots.otomashen.com:6969/transaction/getAllTransactions', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                }),
                body: fd
            })
                .then((data) => (data.json()))
                .then((data) => {
                    dispatch({
                        type: OJ_RECENT_TRANS,
                        recentTrans: (
                            data
                        )
                    })
                })
        };
    },
    postTransaction: (inputObject, file) => {

        return function (dispatch) {
            const fd = new FormData();
            fd.append('customerId', inputObject.customerId)
            fd.append('upload_file', file)
            fd.append('fileType', file.name.split("."))
            fd.append('fileName', file.name)
            fd.append('action', '"' + JSON.stringify(inputObject.action) + '"')
            // console.log("sdgsd", '"'+ JSON.stringify(inputObject.action) + '"')
            fetch('https://otobots.otomashen.com:6969/client/postTransaction', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                }),
                body: fd
            })
                .then((data) => (data.json()))
                .then((data) => {
                    dispatch({
                        type: OJ_TRANSACTION_ID,
                        transactionId: (
                            data
                        )

                    })
                   // history.push('/dashboard/'+data.transactionId)
                   // dispatch(getDetails(data))
                })
        };
    },

};

export const getDetails = (data) => {
    return function (dispatch) {
         const fd = new FormData();
         fd.append('transactionId', data.transactionId)
        //  fd.append('upload_file', file)
        //  fd.append('action',   '"'+ JSON.stringify(inputObject.action) + '"')
        // console.log("sdgsd", '"'+ JSON.stringify(inputObject.action) + '"')
        fetch('https://otobots.otomashen.com:6969/transaction/getDetails', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            }),
            body:fd

        })
            .then((data) => (data.json()))
            .then((data) => {
                dispatch({
                    type: OJ_DETAILS,
                    details: (
                        data
                    )
                })

            })
    };


}



export default actions;
