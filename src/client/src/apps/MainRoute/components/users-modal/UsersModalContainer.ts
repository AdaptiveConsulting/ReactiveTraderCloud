import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { GlobalState } from 'StoreTypes'
import UsersModal from './UsersModal'
import { selectSelectingUser } from '../../data/userStatus'
import { UserActions } from 'rt-actions'
import { User } from 'rt-types'

const mapStateToProps = (state: GlobalState) => ({
  shouldShow: selectSelectingUser(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(UserActions.notSelected()),
  selectUser: (user: User) => dispatch(UserActions.selected(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UsersModal)
