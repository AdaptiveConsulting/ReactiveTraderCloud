import { connect } from 'react-redux'

import { GlobalState } from 'combineReducers'
import { FooterActions } from './actions'
import Footer from './Footer'

const { openLink, toggleStatusServices } = FooterActions

const mapStateToProps = ({ compositeStatusService, displayStatusServices, connectionStatus }: GlobalState) => ({
  compositeStatusService,
  displayStatusServices,
  connectionStatus
})

export default connect(
  mapStateToProps,
  {
    toggleStatusServices,
    openLink
  }
)(Footer)
