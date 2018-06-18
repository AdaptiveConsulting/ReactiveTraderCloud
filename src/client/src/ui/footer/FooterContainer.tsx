import { connect } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { openLink } from '../../linkEpic'
import { FooterActions } from './actions'
import Footer from './Footer'

const { toggleStatusServices } = FooterActions

const mapStateToProps = ({
  compositeStatusService,
  displayStatusServices,
  connectionStatus,
  environment
}: GlobalState) => ({
  compositeStatusService,
  displayStatusServices,
  connectionStatus,
  isRunningOnDesktop: environment.isRunningOnDesktop
})

export default connect(
  mapStateToProps,
  {
    toggleStatusServices,
    openLink
  }
)(Footer)
