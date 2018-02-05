import * as React from 'react'
import { connect } from 'react-redux'
import * as PropTypes from 'prop-types'
import FooterView, { Services } from './FooterView'
import { bindActionCreators, Dispatch } from 'redux'
import { toggleStatusServices } from './FooterOperations'
import { Connections } from '../../connectionStatusOperations'

interface FooterContainerOwnProps {

}

interface FooterContainerStateProps {
  compositeStatusService: Services
  displayStatusServices: boolean
  connectionStatus: Connections
}

interface FooterContainerDispatchProps {
  toggleStatusServices: () => void
}

type FooterContainerProps = FooterContainerOwnProps & FooterContainerStateProps & FooterContainerDispatchProps

class FooterContainer extends React.Component<FooterContainerProps, any> {

  static contextTypes = {
    openFin: PropTypes.object
  }

  render() {
    return (
      <FooterView
        compositeStatusService={this.props.compositeStatusService}
        connectionStatus={this.props.connectionStatus}
        toggleStatusServices={this.props.toggleStatusServices}
        displayStatusServices={this.props.displayStatusServices}
        openFin={this.context.openFin}
        isRunningInOpenFin={!!this.context.openFin}
      />
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  toggleStatusServices,
}, dispatch)

function mapStateToProps({ compositeStatusService, displayStatusServices, connectionStatus }) {
  return { compositeStatusService, displayStatusServices, connectionStatus }
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterContainer)
