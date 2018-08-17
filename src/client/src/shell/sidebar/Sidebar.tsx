import React from 'react'
import { SidebarRegionActions } from './actions'

import { RegionContent, Root } from './styled'

interface SidebarProps {
  displayAnalytics: boolean
  toggleAnalytics?: typeof SidebarRegionActions.toggleAnalytics

  tornOff: boolean
  renderContent: () => JSX.Element
}

export class Sidebar extends React.PureComponent<SidebarProps> {
  render() {
    const { renderContent } = this.props

    return (
      <Root>
        <RegionContent>{renderContent()}</RegionContent>
      </Root>
    )
  }
}

export default Sidebar
