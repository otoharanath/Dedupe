import {
    OJ_OPTION_DATA
} from '.';

let actions = {

    getOptionData: () => {
        return function (dispatch) {

            fetch('https://otobots.otomashen.com:6969/transaction/getMetaData', {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer '+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhcmlrc2hpdHNoYXJtYTcwQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmQiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE1NzA3NDU1NjQsImV4cCI6MTU3MDc0OTE2NH0.t3t8F6ioHLmA1KhprWzIiO002etQQ7GgvnwAoenMg14', 
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
    }
}
export default actions;
