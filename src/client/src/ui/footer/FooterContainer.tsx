import { connect } from 'react-redux'

import { GlobalState } from 'combineReducers'
import { selectIsConnected, selectTransportType, selectUrl } from 'ui/connectionStatus'

import Footer from './Footer'
import { selectCombinedServiceStatus } from './selectors'

const mapStateToProps = (state: GlobalState) => ({
  url: selectUrl(state),
  isConnected: selectIsConnected(state),
  transportType: selectTransportType(state),
  serviceStatus: selectCombinedServiceStatus(state)
})

export default connect(mapStateToProps)(Footer)
