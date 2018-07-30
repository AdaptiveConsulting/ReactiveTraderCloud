import { connect } from 'react-redux'

import { GlobalState } from 'combineReducers'
import { selectServiceStatus } from 'ui/compositeStatus'
import { selectIsConnected, selectTransportType, selectUrl } from 'ui/connectionStatus'

import { FooterActions } from './actions'
import Footer from './Footer'

const { openLink, toggleStatusServices } = FooterActions

const mapStateToProps = (state: GlobalState) => ({
  url: selectUrl(state),
  isConnected: selectIsConnected(state),
  transportType: selectTransportType(state),
  serviceStatus: selectServiceStatus(state)
})

const mapDispatchToProps = () => ({
  toggleStatusServices,
  openLink
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer)
