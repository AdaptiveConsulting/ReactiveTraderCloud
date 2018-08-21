import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { ConnectionActions } from 'rt-actions'
import { ConnectionStatus } from 'rt-system'
import { ShellActions } from 'shell'

import { GlobalState } from 'StoreTypes'
import Shell from './Shell'

const mapStateToProps = (state: GlobalState) => ({
  connected: state.connectionStatus.status === 'connected',
  loaded: Object.keys(state.compositeStatusService).length >= 3,
  sessionExpired: state.connectionStatus.status === ConnectionStatus.sessionExpired
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reconnect: () => {
    dispatch(ConnectionActions.connect())
  },
  openLink: (link: string) => {
    dispatch(ShellActions.openLink(link))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shell)
