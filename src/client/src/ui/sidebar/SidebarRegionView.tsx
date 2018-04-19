import * as classnames from 'classnames'
import * as React from 'react'

import { AnalyticsContainer } from '../analytics'

interface SidebarRegionViewProps {
  displayAnalytics: boolean
  toggleAnalytics: () => void
}

export const SidebarRegionView: React.SFC<SidebarRegionViewProps> = (props: SidebarRegionViewProps) => {

  const buttonStyles = classnames('sidebar-region__element-button glyphicon glyphicon-stats', props.displayAnalytics && 'sidebar-region__element--active' || 'sidebar-region__element--inactive')
  const analyticsStyles = classnames('sidebar-region__content', !props.displayAnalytics && 'sidebar-region__container--no-content')

  return (
    <div className="shell__sidebar">
      <div className={analyticsStyles}>
        <AnalyticsContainer/>
      </div>
      <div className="sidebar-region__container">
        <i className={buttonStyles} onClick={() => props.toggleAnalytics()}/>
        <div className="sidebar-region__element"></div>
      </div>
    </div>
  )
}
