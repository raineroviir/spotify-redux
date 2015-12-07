import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import createLogger from 'redux-logger';
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import routes from '../routes';

const logger = createLogger({
  predicate: (getState, action) => process.env.NODE_ENV === `development`
});

const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
