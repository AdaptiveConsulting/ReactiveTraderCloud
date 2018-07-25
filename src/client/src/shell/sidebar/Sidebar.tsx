import React from 'react'
import { SidebarRegionActions } from './actions'
import { getSidebarStyles } from './sidebarUtils'
import Toggle from './Toggle'

interface SidebarProps {
  displayAnalytics: boolean
  toggleAnalytics: typeof SidebarRegionActions.toggleAnalytics

  tornOff: boolean
  renderContent: () => JSX.Element
}

export class Sidebar extends React.PureComponent<SidebarProps> {
  render() {
    const { displayAnalytics, toggleAnalytics, tornOff, renderContent } = this.props

    const showButton = displayAnalytics
    const { analyticsStyles, buttonStyles } = getSidebarStyles(showButton)

    return (
      <div className="shell__sidebar">
        <div className={analyticsStyles}>{renderContent()}</div>
        <Toggle show={!tornOff}>
          <div className="sidebar-region__container">
            <i className={buttonStyles} onClick={toggleAnalytics} />
            <div className="sidebar-region__element" />
          </div>
        </Toggle>
      </div>
    )
  }
}

export default Sidebar
