import { connect } from 'react-redux'
import { reconnect } from './actions'
import Shell from './Shell'
import { ConnectionStatus } from '../../types/connectionStatus';

function mapStateToProps({ connectionStatus }) {
  const sessionExpired = connectionStatus.connection === ConnectionStatus.sessionExpired
  return { sessionExpired }
}

export default connect(mapStateToProps, { reconnect })(Shell)
