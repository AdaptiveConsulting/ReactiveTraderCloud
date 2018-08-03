import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { GlobalState } from 'combineReducers'
import { ShellActions } from 'shell'
import { selectType, ThemeActions } from 'shell/theme'

import Header from './Header'

const { openLink } = ShellActions
const { toggleTheme } = ThemeActions

const mapStateToProps = (state: GlobalState) => ({
  theme: selectType(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openLink: (link: string) => {
    dispatch(openLink(link))
  },
  toggleTheme: () => {
    dispatch(toggleTheme())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
