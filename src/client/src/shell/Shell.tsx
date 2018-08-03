import { withTheme } from 'emotion-theming'
import React from 'react'
import Transition from 'react-addons-css-transition-group'

import { Theme } from 'rt-themes'
import { styled } from 'rt-util'
import Footer from 'ui/footer'

import Header from './components/Header'
import ReconnectModal from './components/ReconnectModal'
import SplashScreen from './components/SplashScreen'
import { Themes } from './theme'

const StyledShell = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.fontFamily.primary};
`

const Body = styled('div')`
  flex: 1;
  width: 100%;
  position: relative;
  background-color: ${({ theme }) => theme.shell.backgroundColor};
  min-height: 0;
  min-width: 0;
`

const SplashScreenContainer = styled('div')`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 200;
`

interface State {
  loaded: boolean
}

const initialState: State = {
  loaded: false
}

interface Props {
  sessionExpired: boolean
  reconnect: () => void
  theme?: Theme
  themeType: Themes
  openLink: (url: string) => void
  toggleTheme: () => void
}
class Shell extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = initialState
  }

  componentDidMount() {
    setTimeout(this.onLoaded.bind(this), 1000)
  }

  onLoaded() {
    this.setState({
      loaded: true
    })
  }
  render() {
    const { children, sessionExpired, reconnect, theme, themeType, openLink, toggleTheme } = this.props
    const { loaded } = this.state
    return (
      <StyledShell>
        <Header theme={themeType} openLink={openLink} toggleTheme={toggleTheme} />
        <Body>{children}</Body>
        <Footer />
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
      </StyledShell>
    )
  }
}

export default withTheme(Shell)
