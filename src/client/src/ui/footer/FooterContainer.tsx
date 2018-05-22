import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { GlobalState } from '../../combineReducers'
import { openLink } from '../../linkEpic'
import { toggleStatusServices } from './FooterOperations'
import FooterView from './FooterView'

type FooterContainerProps = FooterContainerStateProps & FooterContainerDispatchProps

class FooterContainer extends React.Component<FooterContainerProps, any> {
  render() {
    return (
      <FooterView
        compositeStatusService={this.props.compositeStatusService}
        connectionStatus={this.props.connectionStatus}
        toggleStatusServices={this.props.toggleStatusServices}
        displayStatusServices={this.props.displayStatusServices}
        isRunningOnDesktop={this.props.isRunningOnDesktop}
        openLink={this.props.openLink}
      />
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      toggleStatusServices,
      openLink
    },
    dispatch
  )

function mapStateToProps({
  compositeStatusService,
  displayStatusServices,
  connectionStatus,
  environment
}: GlobalState) {
  return {
    compositeStatusService,
    displayStatusServices,
    connectionStatus,
    isRunningOnDesktop: environment.isRunningOnDesktop
  }
}

type FooterContainerStateProps = ReturnType<typeof mapStateToProps>

type FooterContainerDispatchProps = ReturnType<typeof mapDispatchToProps>

export default connect(mapStateToProps, mapDispatchToProps)(FooterContainer)
