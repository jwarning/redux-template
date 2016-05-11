import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router'
import AppContainer from '../containers/AppContainer'

export default function Root({ store, history }) {
  return <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={AppContainer} />
    </Router>
  </Provider>
}
