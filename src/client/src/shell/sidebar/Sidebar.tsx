import React from 'react'
import { ThemeProvider } from 'rt-theme'
import { SidebarRegionActions } from './actions'
import Toggle from './Toggle'

import { RegionContainer, RegionContent, RegionElement, Root } from './styled'

interface SidebarProps {
  displayAnalytics: boolean
  toggleAnalytics: typeof SidebarRegionActions.toggleAnalytics

  tornOff: boolean
  renderContent: () => JSX.Element
}

export class Sidebar extends React.PureComponent<SidebarProps> {
  render() {
    const { displayAnalytics, toggleAnalytics, tornOff, renderContent } = this.props

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
          <Toggle show={!tornOff}>
            <RegionContainer>
              {displayAnalytics && (
                <i className="sidebar-region__element-button glyphicon glyphicon-stats" onClick={toggleAnalytics} />
              )}
              <RegionElement />
            </RegionContainer>
          </Toggle>
        </Root>
      </ThemeProvider>
    )
  }
}

export default Sidebar
