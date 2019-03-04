import React from 'react'

import {
  faExclamationCircle,
  faCheckCircle,
  faCircleNotch,
  faTimes,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { keyframes } from 'styled-components'

import { styled } from 'rt-theme'
import { useMultiTimeout, Extends } from 'rt-util'
import { Block } from '../StyleguideRoute/styled'
import { AccentName } from 'rt-theme'

// Subset of accents that make sense as intent semantically
type Intent = Extends<AccentName, 'good' | 'bad' | 'aware'>

export interface NotificationProps {
  duration: number
  position: 'bottom' | 'top'
  intent: Intent
  event?: unknown
  children: React.ReactNode
  onEnd?: () => void
}

const intents: { [intent in Intent]: { icon: IconDefinition } } = {
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

const Notification: React.FC<NotificationProps> = ({ duration, intent, position, children, onEnd, ...bodyProps }) => {
  const [stage, goToStage] = useMultiTimeout(
    {
      duration,
    },
    {
      duration: 250,
      onLeave: onEnd,
    },
  )
  const visible = stage === 0

  return (
    <Position position={position} p={1}>
      <Transition key={visible ? 'show' : 'hide'} visible={visible} position={position} duration={200}>
        <Body bg={t => t.button[intent].backgroundColor} fg={t => t.button[intent].textColor} p={2} {...bodyProps}>
          <Block fontSize={2.5} fg={t => t.accents[intent].lighter}>
            <FontAwesomeIcon icon={intents[intent].icon} />
          </Block>
          <Summary>{children}</Summary>
          <Block onClick={() => goToStage(1)} fontSize={1}>
            <FontAwesomeIcon icon={faTimes} />
          </Block>
        </Body>
      </Transition>
    </Position>
  )
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

const Position = styled(Block)<{ position?: 'top' | 'bottom' }>`
  position: absolute;
  left: 0;
  right: 0;
  ${({ position }) => ({ [position]: 0 })};

  z-index: 10;
`
Position.defaultProps = {
  position: 'bottom',
}

const Transition = styled(Block)<{ visible?: boolean; position?: 'top' | 'bottom'; duration?: number }>`
  transition: transform ease ${({ duration = 200 }) => duration}ms, opacity ease ${({ duration = 200 }) => duration}ms;

  opacity: 0;
  animation-duration: ${({ duration = 200 }) => duration}ms;
  animation-fill-mode: both;
  animation-direction: ${({ visible }) => (visible ? 'normal' : 'reverse')};
  ${({ position }) => TransitionFrom[position]};
`
Transition.defaultProps = {
  position: 'bottom',
}
const TransitionFrom = {
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
