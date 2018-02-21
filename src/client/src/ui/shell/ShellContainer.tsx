import { connect } from 'react-redux'
import { ConnectionStatus } from './'
import { reconnect } from './actions'
import Shell from './shell'

function mapStateToProps({ connectionStatus }) {
  const sessionExpired = connectionStatus.connection === ConnectionStatus.sessionExpired
  return { sessionExpired }
}

export default connect(mapStateToProps, { reconnect })(Shell)
