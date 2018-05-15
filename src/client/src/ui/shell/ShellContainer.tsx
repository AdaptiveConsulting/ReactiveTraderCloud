import { connect } from 'react-redux'
import { connect as reconnect } from '../../connectionActions'
import { ConnectionStatus } from '../../system'
import Shell from './Shell'

function mapStateToProps(state: any) {
  const { connectionStatus, regionsService } = state
  const sessionExpired =
    connectionStatus.status === ConnectionStatus.sessionExpired

  // show splitter at the initialisation step (blotter not added to the state yet) or if it isn't teared off
  const showSplitter =
    !regionsService.blotter ||
    (regionsService.blotter && regionsService.blotter.isTearedOff === false)
  return { sessionExpired, showSplitter }
}

export default connect(mapStateToProps, { reconnect })(Shell)
