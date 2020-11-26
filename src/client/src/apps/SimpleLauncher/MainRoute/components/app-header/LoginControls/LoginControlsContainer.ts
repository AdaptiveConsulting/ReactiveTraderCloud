import { connect } from 'react-redux'
import { GlobalState } from 'StoreTypes'
import LoginControls from './LoginControls'
import { selectUser } from '../../../data/userStatus'

const mapStateToProps = (state: GlobalState) => ({
  user: selectUser(state),
})

export default connect(mapStateToProps)(LoginControls)
