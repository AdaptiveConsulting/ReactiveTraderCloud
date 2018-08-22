import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { GlobalState } from 'combineReducers'
import { ConnectionActions } from 'rt-actions'
import { ConnectionStatus } from 'rt-system'

export default connect(
  (state: GlobalState) => ({
    connected: state.connectionStatus.status === 'connected',
    loaded: Object.keys(state.compositeStatusService).length >= 3,
    sessionExpired: state.connectionStatus.status === ConnectionStatus.sessionExpired,
    shouldShow: true || state.connectionStatus.status === ConnectionStatus.sessionExpired
  }),
  (dispatch: Dispatch) => ({
    reconnect: () => dispatch(ConnectionActions.connect())
  })
)
