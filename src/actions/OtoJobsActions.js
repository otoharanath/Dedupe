import {
    OJ_OPTION_DATA,
    OJ_TRANSACTION_ID,
    OJ_DETAILS,
    OJ_RECENT_TRANS,
    LOGIN_USER
} from '.';
const token = localStorage.getItem('user');
const customerId = localStorage.getItem('customerId');
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
            fd.append('customerId', localStorage.getItem('customerId'))
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
            fd.append('customerId', localStorage.getItem('customerId'))
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

        fetch('https://otobots.otomashen.com:6969/transaction/getDetails', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            }),
            body: fd

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

export const userLoginFetch = (user) => {
    return function (dispatch) {
        const fd = new FormData();
        fd.append('email', user.email)
        fd.append('password', user.password)

        fetch("https://otobots.otomashen.com:6969/client/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: fd
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.message) {

                } else {
                    localStorage.setItem("token", data.token)
                    dispatch(loginUser(data.user))
                }
            })
    }
}

const loginUser = userObj => ({
    type: 'LOGIN_USER',
    payload: userObj
})



export default actions;
