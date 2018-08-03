import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { GlobalState } from 'combineReducers'
import { ConnectionActions } from 'rt-actions'
import { ShellActions } from 'shell'
import { selectType, ThemeActions } from 'shell/theme'
import { ConnectionStatus } from 'system'

import Shell from './Shell'

const mapStateToProps = (state: GlobalState) => ({
  sessionExpired: state.connectionStatus.status === ConnectionStatus.sessionExpired,
  themeType: selectType(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reconnect: () => {
    dispatch(ConnectionActions.connect())
  },
  openLink: (link: string) => {
    dispatch(ShellActions.openLink(link))
  },
  toggleTheme: () => {
    dispatch(ThemeActions.toggleTheme())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shell)
