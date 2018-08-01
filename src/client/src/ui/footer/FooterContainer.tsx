import { connect } from 'react-redux'

import { GlobalState } from 'combineReducers'
import { selectIsConnected, selectTransportType, selectUrl } from 'ui/connectionStatus'

import { FooterActions } from './actions'
import Footer from './Footer'
import { selectCombinedServiceStatus } from './selectors'

const { openLink, toggleStatusServices } = FooterActions

const mapStateToProps = (state: GlobalState) => ({
  url: selectUrl(state),
  isConnected: selectIsConnected(state),
  transportType: selectTransportType(state),
  serviceStatus: selectCombinedServiceStatus(state)
})

const mapDispatchToProps = () => ({
  toggleStatusServices,
  openLink
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
