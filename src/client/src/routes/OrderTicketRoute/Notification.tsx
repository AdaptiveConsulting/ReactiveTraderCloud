import * as React from 'react'

import { faExclamationCircle, faCheckCircle, faCircleNotch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Block } from '../StyleguideRoute/styled'

import { Timer } from './Timer'
import { styled } from 'rt-theme'
import { keyframes } from 'styled-components'

export interface NotificationProps {
  duration: number
  position: 'bottom' | 'top'
  intent: 'good' | 'aware' | 'bad'
  event?: unknown
  children: React.ReactNode
  onEnd?: () => void
}

interface State {
  visible: boolean
}

const intents = {
  good: {
    icon: faCheckCircle,
  },
  aware: {
    icon: faCircleNotch,
  },
  bad: {
    icon: faExclamationCircle,
  },
}

class Notification extends React.PureComponent<NotificationProps, State> {
  state = {
    visible: true,
  }

  onSeen = () => this.setState({ visible: false })
  onEnd = () => {
    if (this.props.onEnd) {
      this.props.onEnd()
    }
  }

  render() {
    const { duration, intent, position, children, onEnd, ...props } = this.props
    const { visible } = this.state

    return (
      <React.Fragment>
        {visible ? (
          <Timer key="start" duration={duration} timeout={this.onSeen} />
        ) : (
          <Timer key="end" duration={500} timeout={this.onEnd} />
        )}
        <Position position={position} p={1}>
          <Transistion key={visible ? 'show' : 'hide'} visible={visible} position={position}>
            <Body bg={`button.${intent}.backgroundColor`} fg={`button.${intent}.textColor`} p={2} {...props}>
              <Block fontSize={2.5} color={`accents.${intent}.2`}>
                <FontAwesomeIcon icon={intents[intent].icon} />
              </Block>
              <Summary>{children}</Summary>
              <Block onClick={this.onSeen} fontSize={1}>
                <FontAwesomeIcon icon={faTimes} />
              </Block>
            </Body>
          </Transistion>
        </Position>
      </React.Fragment>
    )
  }
}

const Summary = styled(Block)`
  width: 100%;
  min-height: 2.5rem;
`

const Body = styled(Block)`
  max-width: 22rem;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  display: grid;
  grid-template-columns: auto 3fr auto;
  grid-column-gap: 1rem;
  align-items: flex-start;

  border-radius: 0.25rem;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1rem 4rem -1rem ${props => props.theme.overlay.backgroundColor};
`

const Position: any = styled(Block)<{ position?: 'top' | 'bottom' }>`
  position: absolute;
  left: 0;
  right: 0;
  ${({ position }) => ({ [position]: 0 })} bottom: 0;

  z-index: 10;
`
Position.defaultProps = {
  position: 'bottom',
}

const Transistion: any = styled(Block)<{ visible?: boolean; position?: 'top' | 'bottom' }>`
  transition: transform ease 200ms, opacity ease 200ms;

  opacity: 0;
  animation-duration: 200ms;
  animation-fill-mode: both;
  animation-direction: ${({ visible }) => (visible ? 'normal' : 'reverse')};
  ${({ position }) => Transistion.from[position]};
`
Transistion.defaultProps = {
  position: 'bottom',
}
Transistion.from = {
  top: [
    `transform: translateY(-100%);`,
    `animation-name:`,
    keyframes`
    from {
      opacity: 0;
      transform: translateY(-100%);
    }
    to {
      opacity: 1;
      transform: translateY(0%)
    }
  `,
  ],
  bottom: [
    `transform: translateY(100%);`,
    `animation-name:`,
    keyframes`
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0%)
    }
  `,
  ],
}

export default Notification
export { Notification }
