import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import store from './store';
import {BrowserRouter} from 'react-router-dom';
import { AUTHENTICATED } from './actions/LoginAction';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 

const user = localStorage.getItem('user');

if(user) {
  store.dispatch({ type: AUTHENTICATED });
}


ReactDOM.render(
<Provider store={store}>
<BrowserRouter> <App /> </BrowserRouter>
 </Provider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
