import _ from 'lodash'
import { connect } from 'react-redux'

import { GlobalState } from 'StoreTypes'
import { selectServices } from './selectors'
import { StatusBar } from './StatusBar'

const mapStateToProps = (state: GlobalState) => {
  return {
    connectionStatus: state.connectionStatus,
    services: selectServices(state)
  }
}

export default connect(mapStateToProps)(StatusBar)
