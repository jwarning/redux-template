import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers/root'
import AppContainer from './containers/AppContainer'

import './styles/index.css'

const dev = process.env.NODE_ENV !== 'production'
const reduxRouterMiddleware = routerMiddleware(browserHistory)

let middleware = [
  thunkMiddleware,
  reduxRouterMiddleware
]

if (dev) {
  // only use logger in development mode
  middleware.push(createLogger())
}

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      // enable chrome redux debugging extension if available
      dev && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (module.hot) {
    // enable webpack hot module replacement for reducers
    module.hot.accept('./reducers/root', () => {
      const nextRootReducer = require('./reducers/root').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={AppContainer}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
