import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { GlobalState } from 'StoreTypes'
import LoginControls from './LoginControls'
import { selectSelectingUser, selectUser } from '../../../data/userStatus'
import { UserActions } from 'rt-actions'

const mapStateToProps = (state: GlobalState) => ({
  isDisplayingUserList: selectSelectingUser(state),
  user: selectUser(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  selectUser: () => dispatch(UserActions.select()),
  logOut: () => dispatch(UserActions.remove()),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginControls)
