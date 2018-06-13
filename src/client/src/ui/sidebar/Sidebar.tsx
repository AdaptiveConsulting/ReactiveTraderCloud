import * as React from 'react'
import { connect } from 'react-redux'
import { AnalyticsContainer } from '../analytics'
import { SidebarRegionActions } from './actions'
import { getSidebarStyles } from './sidebarUtils'

interface SidebarProps {
  displayAnalytics: boolean
  toggleAnalytics: typeof SidebarRegionActions.toggleAnalytics
}

const Sidebar: React.SFC<SidebarProps> = ({ displayAnalytics, toggleAnalytics }: SidebarProps) => {
  const { analyticsStyles, buttonStyles } = getSidebarStyles(displayAnalytics)

  return (
    <div className="shell__sidebar">
      <div className={analyticsStyles}>
        <AnalyticsContainer />
      </div>
      <div className="sidebar-region__container">
        <i className={buttonStyles} onClick={toggleAnalytics} />
        <div className="sidebar-region__element" />
      </div>
    </div>
  )
}

const mapStateToProps = ({ displayAnalytics }) => ({
  displayAnalytics
})

export default connect(
  mapStateToProps,
  { toggleAnalytics: SidebarRegionActions.toggleAnalytics }
)(Sidebar)
