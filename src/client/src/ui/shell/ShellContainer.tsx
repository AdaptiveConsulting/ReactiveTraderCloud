import { connect } from 'react-redux'
import { ConnectionStatus } from '../../types'
import { reconnect } from './actions'
import Shell from './Shell'

function mapStateToProps( state: any ) {
  const { connectionStatus, regionsService } = state
  const sessionExpired = connectionStatus.connection === ConnectionStatus.sessionExpired

  // show splitter at the initialisation step (blotter not added to the state yet) or if it isn't teared off
  const showSplitter = !regionsService.blotter || regionsService.blotter && regionsService.blotter.isTearedOff === false
  return { sessionExpired, showSplitter }
}

export default connect(mapStateToProps, { reconnect })(Shell)
