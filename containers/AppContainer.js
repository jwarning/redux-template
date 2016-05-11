import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose, pure, setPropTypes } from 'recompose'

const AppContainer = compose(
  pure,
  setPropTypes({
  })
)(props => {
  return <div>Hello</div>
})

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(AppContainer)
