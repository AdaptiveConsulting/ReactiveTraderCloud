import React from 'react'

import { styled, ThemeName, useTheme } from 'rt-theme'

import Logo from './Logo'

class Header extends React.Component {
  // The added buttons handle the Spot windows management

  // The state handles the buttons visibility
  state = {
    showStackAll: false,
    showTabAll: false,
    showToggleCollapse: false,
  }

  componentDidMount() {
    // On Spot window open/close the buttons visibility is updated
    const interval = setInterval(() => {
      if (!(window as any).glue) {
        return
      }
      (window as any).glue.agm.register(
        'toggleHeaderButtons',
        (args: { numberOfOpenedWindows: number }) => {
          this.setState({
            showStackAll: args.numberOfOpenedWindows > 1,
            showTabAll: args.numberOfOpenedWindows > 1,
            showToggleCollapse: args.numberOfOpenedWindows > 0,
          })
        },
      )
      clearInterval(interval)
    }, 500)
  }

  onClick = () => window.open('https://weareadaptive.com/')

  // On button click a Glue method is invoked

  stackAll() {
    (window as any).glue.agm.invoke('stackAllWindows')
  }

  tabAll() {
    (window as any).glue.agm.invoke('tabAllWindows')
  }

  toggleCollapse() {
    (window as any).glue.agm.invoke('toggleCollapse')
  }

  render() {
    const { children } = this.props
    return (
      <Root>
        <Logo size={1.75} onClick={this.onClick} />

        <Fill />
        {this.state.showStackAll && (
          <IconButton onClick={this.stackAll} type="primary" title={'Stack All'}>
            <i className="fas fa-layer-group" data-tip="hello world" />
          </IconButton>
        )}
        {this.state.showTabAll && (
          <IconButton onClick={this.tabAll} type="primary" title={'Tab All'}>
            <i className="fas fa-window-restore" />
          </IconButton>
        )}
        {this.state.showToggleCollapse && (
          <IconButton onClick={this.toggleCollapse} type="primary" title={'Toggle Collapse'}>
            <i className="fas fa-minus" />
          </IconButton>
        )}
        <ThemeControl />
        {children == null ? null : (
          <React.Fragment>
            <Division />
            {children}
          </React.Fragment>
        )}
      </Root>
    )
  }
}

const ThemeControl = () => {
  const { themeName, toggleTheme } = useTheme()
  return (
    <IconButton onClick={toggleTheme}>
      <i className={`fa${themeName === ThemeName.Light ? 'r' : 's'} fa-lightbulb`} />
    </IconButton>
  )
}

const Root = styled.div`
  width: 100%;
  max-width: 100%;

  min-height: 3.5rem;
  max-height: 3.5rem;

  padding: 0 1rem;

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};

  position: relative;
  z-index: 10;

  box-shadow: 0 0.125rem 0 ${({ theme }) => theme.core.darkBackground};
`

const Fill = styled.div`
  flex: 1;
  height: calc(3.5rem - 5px);
  margin-top: 5px;
  /**
    TODO 8/22 extract this extension of header, and the fill outside header layout
  */
  -webkit-app-region: drag;
  cursor: -webkit-grab;
`

const IconButton = styled.button`
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  cursor: pointer;

  transition: background-color ${({ theme }) => theme.motion.duration}ms
    ${({ theme }) => theme.motion.easing};

  &:hover {
    background-color: ${({ theme }) => theme.button.secondary.active.backgroundColor};
    color: ${({ theme }) => theme.button.secondary.textColor};
  }
`

const Division = styled.div`
  height: 100%;
  padding: 0 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    display: block;
    width: 0.125rem;
    height: 100%;
    margin-right: -0.125rem;
    background-color: ${props => props.theme.core.darkBackground};
  }
`

export default Header
