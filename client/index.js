import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App.js';
import { createHistory } from 'history';

import { ReduxRouter } from 'redux-router';
import { Router } from 'react-router';
import routes from '../common/routes.js';

const history = createHistory();
const processENV = 'development';
const initialState = window.__INITIAL_STATE__
const store = configureStore(initialState);
const rootElement = document.getElementById('react');

ReactDOM.render(
  <Provider store={store}>
    <Router children={routes} history={history} />
  </Provider>,
  rootElement
);
