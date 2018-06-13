import * as React from 'react'
import { connect } from 'react-redux'
import { SidebarRegionActions } from './actions'
import { SidebarRegionView } from './SidebarRegionView'

interface SidebarRegionContainerProps {
  displayAnalytics: boolean
  toggleAnalytics: typeof SidebarRegionActions.toggleAnalytics
}

const SidebarRegionContainer: React.SFC<SidebarRegionContainerProps> = ({
  displayAnalytics,
  toggleAnalytics
}: SidebarRegionContainerProps) => (
  <SidebarRegionView displayAnalytics={displayAnalytics} toggleAnalytics={toggleAnalytics} />
)

const mapStateToProps = ({ displayAnalytics }) => ({
  displayAnalytics
})

export default connect(
  mapStateToProps,
  { toggleAnalytics: SidebarRegionActions.toggleAnalytics }
)(SidebarRegionContainer)
