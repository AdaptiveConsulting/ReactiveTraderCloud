import { withTheme } from 'emotion-theming'
import React from 'react'
import Transition from 'react-addons-css-transition-group'

import { Theme } from 'rt-themes'
import { styled } from 'rt-util'

const ModalContainer = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ModalOverlay = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  z-index: 100;
  background: ${({ theme }) => theme.background.dark};
`

const ModalPanel = styled('div')`
  min-width: 600px;
  z-index: 101;
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 5px;
`

const Header = styled('h4')`
  margin: 0px;
  border-bottom: 2px solid ${({ theme }) => theme.palette.brand.primary};
  padding: 5px;
  > span {
    font-size: ${({ theme }) => theme.fontSize.h4};
  }
`

const Body = styled('div')`
  padding: 5px;
`

interface Props {
  shouldShow?: boolean
  title?: string
  onDismiss?: () => void
  theme?: Theme
}

// TODO disable tabbing outside of the modal
// tslint:disable-next-line:variable-name
class Modal extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.onDismiss = this.onDismiss.bind(this)
  }

  onDismiss() {
    const { onDismiss } = this.props
    if (onDismiss) {
      onDismiss()
    }
  }

  render() {
    const { shouldShow, title, children, theme } = this.props
    return (
      <Transition
        transitionName={`fade${theme.animationSpeed.slow}`}
        transitionEnterTimeout={theme.animationSpeed.slow}
        transitionLeaveTimeout={theme.animationSpeed.slow}
      >
        {shouldShow && (
          <ModalContainer>
            <ModalOverlay onClick={this.onDismiss} />
            <ModalPanel>
              {title && (
                <Header>
                  <span> {title}</span>
                </Header>
              )}
              <Body>{children}</Body>
            </ModalPanel>
          </ModalContainer>
        )}
      </Transition>
    )
  }
}

export default withTheme(Modal)
