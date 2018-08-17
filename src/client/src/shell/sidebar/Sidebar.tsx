import React from 'react'
import { ThemeProvider } from 'rt-theme'
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
      <ThemeProvider
        theme={theme => ({
          backgroundColor: theme.primary.base,
          textColor: theme.shell.textColor,
          shadowColor: theme.shell.textColor,
          hover: theme.component.hover
        })}
      >
        <Root>
          <RegionContent>{renderContent()}</RegionContent>
        </Root>
      </ThemeProvider>
    )
  }
}

export default Sidebar
