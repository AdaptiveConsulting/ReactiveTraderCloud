import { connect } from 'react-redux'
import { reconnect } from './actions'
import Shell from './Shell'

function mapStateToProps({ connectionStatus }) {
  const sessionExpired = connectionStatus.connection !== 'connected' && connectionStatus.connection !== 'idle'
  return { sessionExpired }
}

export default connect(mapStateToProps, { reconnect })(Shell)
