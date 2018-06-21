import { connect, Dispatch } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { ConnectionActions } from '../../operations/connectionStatus'
import { ConnectionStatus } from '../../system'
import Shell from './Shell'

const reconnect = ConnectionActions.connect

function mapStateToProps(state: GlobalState) {
  const { connectionStatus, regionsService } = state
  const sessionExpired = connectionStatus.status === ConnectionStatus.sessionExpired

  // show splitter at the initialisation step (blotter not added to the state yet) or if it isn't teared off
  const showSplitter =
    !regionsService.blotter || (regionsService.blotter && regionsService.blotter.isTearedOff === false)
  return { sessionExpired, showSplitter }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reconnect: () => {
    dispatch(reconnect())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shell)
