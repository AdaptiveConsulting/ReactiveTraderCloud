import * as React from 'react'
import { connect } from 'react-redux'
import { SidebarRegionView } from './SidebarRegionView'
import { toggleAnalytics } from './SidebarRegionOperations'
import { bindActionCreators, Dispatch } from 'redux'

interface SidebarRegionContainerOwnProps {

}

interface SidebarRegionContainerStateProps {
  displayAnalytics: boolean
}

interface SidebarRegionContainerDispatchProps {
  toggleAnalytics: () => void
}

type SidebarRegionContainerProps = SidebarRegionContainerOwnProps & SidebarRegionContainerStateProps & SidebarRegionContainerDispatchProps

class SidebarRegionContainer extends React.Component<SidebarRegionContainerProps, any> {

  render() {
    return (
        <SidebarRegionView
          displayAnalytics={this.props.displayAnalytics}
          toggleAnalytics={this.props.toggleAnalytics}
        />
    )
  }
}

const mapStateToProps = ({ displayAnalytics }) => ({
  displayAnalytics,
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  toggleAnalytics,
},                                                                         dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRegionContainer)
