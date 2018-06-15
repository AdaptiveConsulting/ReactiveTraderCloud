import { connect } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { SidebarRegionActions } from './actions'
import Sidebar from './Sidebar'

const mapStateToProps = ({ displayAnalytics }: GlobalState) => ({
  displayAnalytics
})
export default connect(
  mapStateToProps,
  { toggleAnalytics: SidebarRegionActions.toggleAnalytics }
)(Sidebar)
