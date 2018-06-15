import * as React from 'react'
import { AnalyticsContainer } from '../analytics'
import { SidebarRegionActions } from './actions'
import { getSidebarStyles } from './sidebarUtils'

interface SidebarProps {
  displayAnalytics: boolean
  toggleAnalytics: typeof SidebarRegionActions.toggleAnalytics
}

export const Sidebar: React.SFC<SidebarProps> = ({ displayAnalytics, toggleAnalytics }: SidebarProps) => {
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

export default Sidebar
