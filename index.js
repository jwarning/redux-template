import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import Root from './containers/Root'
import rootReducer from './reducers/root'

import './styles/index.css'

const dev = process.env.NODE_ENV !== 'production'
const reduxRouterMiddleware = routerMiddleware(browserHistory)
const middleware = [
  thunkMiddleware,
  reduxRouterMiddleware
]

function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      // only use logger and debugger in development mode
      applyMiddleware(...middleware.concat(dev ? createLogger() : [])),
      // enable chrome redux debugging extension if available
      dev && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

  if (module.hot) {
    module.hot.accept('./reducers/root', () => {
      store.replaceReducer(require('./reducers/root').default)
    })
  }

  return store
}

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)
const rootElement = document.getElementById('app')

function render(RootComponent) {
  ReactDOM.render(
    <AppContainer>
      <RootComponent store={store} history={history} />
    </AppContainer>,
    rootElement
  )
}

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    render(require('./containers/Root').default)
  })
}

render(Root)
