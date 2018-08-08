import styled, { css } from 'react-emotion'
import { darken } from 'polished'
import { Flex, TickCross } from 'rt-components'

import Icon from './Icon'

export const Root = styled('div')`
  position: relative;
  width: 100%;
  height: min-content;

  font-size: 0.75rem;

  transition: transform ${({ theme }) => theme.motion.duration}ms ease;
  ${({ expand }) =>
    expand
      ? ''
      : css`
          transform: translateY(calc(100% - 3rem));
        `};

  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};

  ${Icon} {
    margin-right: 0.5rem;
  }
`

export const Body = styled(Flex)`
  position: relative;
  min-height: 3rem;
  max-height: 3rem;

  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};

  cursor: pointer;
  padding: 0 1rem;
`

export const ExpandIcon = styled('i')`
  transform: rotate(${props => (props.expand ? 180 : 0)}deg);
  transition: transform ${({ theme }) => theme.motion.duration}ms ease;
`

export const Fill = styled('div')`
  flex: ${({ size }) => size || 1};
`

export const ServiceList = styled('div')`
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  box-shadow: 0 0 1rem 0rem rgba(0, 0, 0, 0.1);
`

export const ServiceItem = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  min-height: 3rem;
  max-height: 3rem;
  padding: 0.5rem 1rem;

  background-color: ${({ index = 0, theme }) => darken((index + 1) / 75, theme.backgroundColor)};
  color: ${props => props.theme.textColor};

  ${Icon} {
    margin-left: -0.5rem;
    margin-right: 0.5rem;
  }
`

export const ServiceName = styled('div')`
  text-transform: capitalize;
  font-size: 1rem;
`

export const NodeCount = styled('div')`
  display: block;
  min-height: 1.25rem;
  max-height: 1.25rem;
  line-height: 1.25rem;
  opacity: 0.6;
`
