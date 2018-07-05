import * as React from 'react'
import { AnalyticsContainer } from '../analytics'
import { SidebarRegionActions } from './actions'
import { getSidebarStyles } from './sidebarUtils'
import Toggle from './Toggle'

interface SidebarProps {
  displayAnalytics: boolean
  toggleAnalytics: typeof SidebarRegionActions.toggleAnalytics
  onPopoutClick: () => void
  tornOff: boolean
}

export const Sidebar: React.SFC<SidebarProps> = ({
  displayAnalytics,
  toggleAnalytics,
  onPopoutClick,
  tornOff
}: SidebarProps) => {
  const showButton = displayAnalytics
  const { analyticsStyles, buttonStyles } = getSidebarStyles(showButton)

  return (
    <div className="shell__sidebar">
      <div className={analyticsStyles}>
        <AnalyticsContainer onPopoutClick={onPopoutClick} tornOff={tornOff} />
      </div>
      <Toggle show={!tornOff}>
        <div className="sidebar-region__container">
          <i className={buttonStyles} onClick={toggleAnalytics} />
          <div className="sidebar-region__element" />
        </div>
      </Toggle>
    </div>
  )
}

export default Sidebar
