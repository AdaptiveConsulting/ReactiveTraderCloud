import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { SidebarRegionActions } from './actions'
import { SidebarRegionView } from './SidebarRegionView'

interface SidebarRegionContainerStateProps {
  displayAnalytics: boolean
}

interface SidebarRegionContainerDispatchProps {
  toggleAnalytics: () => void
}

type SidebarRegionContainerProps = SidebarRegionContainerStateProps & SidebarRegionContainerDispatchProps

class SidebarRegionContainer extends React.Component<SidebarRegionContainerProps, any> {
  render() {
    return (
      <SidebarRegionView displayAnalytics={this.props.displayAnalytics} toggleAnalytics={this.props.toggleAnalytics} />
    )
  }
}

const mapStateToProps = ({ displayAnalytics }) => ({
  displayAnalytics
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      toggleAnalytics: SidebarRegionActions.toggleAnalytics
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarRegionContainer)
