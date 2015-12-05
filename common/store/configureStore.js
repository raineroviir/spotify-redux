import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import reduxLogger from 'redux-logger';
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import routes from '../routes';
const createStoreWithMiddleware = applyMiddleware(thunk, reduxLogger())(createStore)

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
