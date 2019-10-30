import axios from 'axios';
export const AUTHENTICATED = 'authenticated_user';
export const UNAUTHENTICATED = 'unauthenticated_user';
export const AUTHENTICATION_ERROR = 'authentication_error';
const URL = 'https://otobots.otomashen.com:6969/client';

export function signInAction({ email, password }, history) {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${URL}/login`, { email, password });
      dispatch({ type: AUTHENTICATED });
      localStorage.setItem('user', res.data.token);
      localStorage.setItem('customerId', res.data.customerId);
      history.push('/');
    } catch(error) {
      dispatch({
        type: AUTHENTICATION_ERROR,
        payload: 'Invalid email or password'
      });
    }
  };
}

export function signOutAction() {
  localStorage.clear();
  return {
    type: UNAUTHENTICATED
  };
}