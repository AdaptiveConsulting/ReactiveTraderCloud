import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { ConnectionActions } from 'rt-actions'
import { ConnectionStatus } from 'rt-system'
import { GlobalState } from 'StoreTypes'

export default connect(
  (state: GlobalState) => ({
    connected: state.connectionStatus.status === 'connected',
    loaded: Object.keys(state.compositeStatusService).length >= 3,
    sessionExpired: state.connectionStatus.status === ConnectionStatus.sessionExpired,
    shouldShow: state.connectionStatus.status === ConnectionStatus.sessionExpired
  }),
  (dispatch: Dispatch) => ({
    reconnect: () => dispatch(ConnectionActions.connect())
  })
)
