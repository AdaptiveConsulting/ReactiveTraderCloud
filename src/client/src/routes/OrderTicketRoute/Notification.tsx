import * as React from 'react'
import { ReactNodeLike } from 'prop-types'

import { faExclamationCircle, faCheckCircle, faCircleNotch, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { styled, keyframes } from 'rt-theme'
// @ts-ignore
import { Block, Text } from '../StyleguideRoute/styled'

import { Timer } from './Timer'

export interface NotificationProps {
  duration: number
  intent: 'good' | 'aware' | 'bad'
  quote: any
  children: ReactNodeLike
  onEnd?: () => any
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

export interface NotificationProps {}

class NotificationLayout extends React.PureComponent<NotificationProps, any> {
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
    const { duration, intent, children } = this.props
    const { visible } = this.state
    return (
      <React.Fragment>
        {visible ? (
          <Timer key="start" duration={duration} timeout={this.onSeen} />
        ) : (
          <Timer key="end" duration={500} timeout={this.onEnd} />
        )}
        <Position key={visible ? 'show' : 'hide'} visible={visible}>
          <Body bg={`button.${intent}.backgroundColor`} fg={`button.${intent}.textColor`} py={2} px={2} m={1}>
            <Block fontSize={3} color={`accents.${intent}.2`}>
              <FontAwesomeIcon icon={intents[intent].icon} />
            </Block>
            <Summary>{children}</Summary>
            <FontAwesomeIcon icon={faWindowClose} />
          </Body>
        </Position>
      </React.Fragment>
    )
  }
}

const Position = styled.div<{ visible?: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  transition: transform ease 200ms, opacity ease 200ms;

  opacity: 0;
  transform: translateY(100%);
  animation-name: ${keyframes`
    from {
      opacity: 0;
      transform: translateY(100%)
    }
    to {
      opacity: 1;
      transform: translateY(0%)
    }
  `};
  animation-duration: 200ms;
  animation-fill-mode: both;
  animation-direction: ${({ visible }) => (visible ? 'normal' : 'reverse')};
`

const Summary = styled(Block)``

const Body = styled(Block)`
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  display: grid;
  grid-template-columns: 5rem auto 1rem;

  min-height: 3rem;

  border-radius: 0.25rem;
`

export default NotificationLayout
export { NotificationLayout as Notification }
