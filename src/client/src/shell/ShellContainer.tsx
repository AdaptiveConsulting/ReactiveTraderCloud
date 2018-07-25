import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { ConnectionActions } from 'rt-actions'
import { GlobalState } from '../combineReducers'
import { ConnectionStatus } from '../system/index'
import Shell from './Shell'

const mapStateToProps = ({ connectionStatus, regionsService }: GlobalState) => ({
  sessionExpired: connectionStatus.status === ConnectionStatus.sessionExpired,
  showSplitter: regionsService.blotter && !regionsService.blotter.isTearedOff
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reconnect: () => {
    dispatch(ConnectionActions.connect())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shell)
