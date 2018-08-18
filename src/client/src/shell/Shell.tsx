import { withTheme } from 'emotion-theming'
import React from 'react'
import styled from 'react-emotion'

import StatusBar from 'ui/StatusBar'

import Header from './components/Header'
import ReconnectModal from './components/ReconnectModal'
import SplashScreen from './components/SplashScreen'

interface State {
  loaded: boolean
}

interface Props {
  connected: boolean
  loaded: boolean
  sessionExpired: boolean
  reconnect: () => void
  openLink: (url: string) => void
}

class Shell extends React.Component<Props, State> {
  static getDerivedStateFromProps(props, state) {
    if (state.loaded == null) {
      return {
        loaded: props.loaded
      }
    }
  }

  state = {
    loaded: null
  }

  componentDidUpdate() {
    const { loaded, connected } = this.props

    if (!loaded && connected) {
      // In the event we connected but have not resolved all services,
      // dismiss loader and handle error state … somewhere, not here … 👴 get off my lawn!
      setTimeout(() => this.setState({ loaded: true }), 500)
    }
  }

  render() {
    const { children, sessionExpired, reconnect, openLink } = this.props
    const { loaded } = this.state

    return (
      <ShellRoot>
        <Header openLink={openLink} />

        <BodyContainer>
          <Body>{children}</Body>
        </BodyContainer>

        <FooterRoot>
          <FooterBody>
            <StatusBar />
          </FooterBody>
        </FooterRoot>

        <ReconnectModal shouldShow={sessionExpired} reconnect={reconnect} />

        {loaded ? null : (
          <SplashScreenContainer>
            <SplashScreen />
          </SplashScreenContainer>
        )}
      </ShellRoot>
    )
  }
}

const ShellRoot = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.shell.backgroundColor};
  color: ${({ theme }) => theme.shell.textColor};
`

const BodyContainer = styled('div')`
  flex: 1;
  display: flex;
  background-color: ${({ theme }) => theme.shell.backgroundColor};
  color: ${({ theme }) => theme.shell.textColor};
`

const Body = styled('div')`
  display: flex;
  flex: 1;
  width: 100%;
  position: relative;
  min-height: 0;
  min-width: 0;
`

const FooterRoot = styled.div`
  position: relative;
  margin-top: 2rem;
`

const FooterBody = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
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
