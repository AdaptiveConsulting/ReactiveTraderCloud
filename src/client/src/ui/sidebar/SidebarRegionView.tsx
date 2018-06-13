import * as classnames from 'classnames'
import * as React from 'react'
import { SidebarRegionActions } from './actions'

import { AnalyticsContainer } from '../analytics'

export interface SidebarRegionViewProps {
  displayAnalytics: boolean
  toggleAnalytics: typeof SidebarRegionActions.toggleAnalytics
}

export const SidebarRegionView: React.SFC<SidebarRegionViewProps> = ({
  displayAnalytics,
  toggleAnalytics
}: SidebarRegionViewProps) => {
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
function getSidebarStyles(displayAnalytics: boolean) {
  const buttonStyles = classnames(
    'sidebar-region__element-button glyphicon glyphicon-stats',
    (displayAnalytics && 'sidebar-region__element--active') || 'sidebar-region__element--inactive'
  )
  const analyticsStyles = classnames(
    'sidebar-region__content',
    !displayAnalytics && 'sidebar-region__container--no-content'
  )
  return { analyticsStyles, buttonStyles }
}
