import { withTheme } from 'emotion-theming'
import React from 'react'
import Transition from 'react-addons-css-transition-group'

import { Theme } from 'rt-themes'
import { styled } from 'rt-util'
import StatusBar from 'ui/StatusBar'

import Header from './components/Header'
import ReconnectModal from './components/ReconnectModal'
import SplashScreen from './components/SplashScreen'
import { Themes } from './theme'

interface State {
  loaded: boolean
}

interface Props {
  connected: boolean
  loaded: boolean
  sessionExpired: boolean
  reconnect: () => void
  theme?: Theme
  themeType: Themes
  openLink: (url: string) => void
  toggleTheme: () => void
}

class Shell extends React.Component<Props, State> {
  static getDerivedStateFromProps(props) {
    return {
      loaded: props.loaded
    }
  }

  state = {
    loaded: false
  }

  componentDidUpdate() {
    const { loaded, connected } = this.props

    if (!loaded && connected) {
      setTimeout(() => this.setState({ loaded: true }), 500)
    }
  }

  render() {
    const { children, sessionExpired, reconnect, theme, themeType, openLink, toggleTheme } = this.props
    const { loaded } = this.state

    return (
      <ShellRoot>
        <Header theme={themeType} openLink={openLink} toggleTheme={toggleTheme} />

        <BodyContainer>
          <Body>{children}</Body>
        </BodyContainer>

        <FooterRoot>
          <FooterBody>
            <StatusBar />
          </FooterBody>
        </FooterRoot>

        <ReconnectModal shouldShow={sessionExpired} reconnect={reconnect} />

        <Transition
          transitionName={`fade${theme.animationSpeed.slow}`}
          transitionLeaveTimeout={theme.animationSpeed.slow}
        >
          {loaded || (
            <SplashScreenContainer>
              <SplashScreen />
            </SplashScreenContainer>
          )}
        </Transition>
      </ShellRoot>
    )
  }
}

const ShellRoot = styled('div')`
  width: 100vw;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.fontFamily.primary};
`

const BodyContainer = styled('div')`
  flex: 1;
  display: flex;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.shell.backgroundColor};
`

const Body = styled('div')`
  flex: 1;
  width: 100%;
  position: relative;
  min-height: 0;
  min-width: 0;
`

const FooterRoot = styled('div')`
  position: relative;
  min-height: 3rem;
  max-height: 3rem;
`

const FooterBody = styled('div')`
  position: absolute;
  top: 0;
  width: 100%;
  min-height: 3rem;
`

const SplashScreenContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
`

export default withTheme(Shell)
