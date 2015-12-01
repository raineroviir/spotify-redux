import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import App from './containers/App.js';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

const processENV = 'development';
const store = configureStore();

ReactDOM.render(
  <div>
    <Provider store={store}>
      <App />
    </Provider>
    {processENV === 'development' && <DebugPanel top right bottom >
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>}
  </div>,
  document.getElementById('react')
);
