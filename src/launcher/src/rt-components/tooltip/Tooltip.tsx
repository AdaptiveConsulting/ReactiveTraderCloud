import React, { useState } from 'react'
import { css } from 'styled-components/macro'
import styled from 'styled-components/macro'

interface Props {
  position?: 'top' | 'bottom' | 'left' | 'right'
  message?: string
}

const TooltipContainer = styled.div`
  position: relative;
  width: auto;
  height: 100%;
`

const TooltipBubble = styled.div<Props>`
  min-width: ${({ message }) => (message ? `${message.length * 6.5}px` : '120px')};
  max-width: 300px;
  position: absolute;
  z-index: 1000;

  &::after {
    content: '';
    position: absolute;
  }

  ${props =>
    props.position === 'bottom' &&
    css`
      top: calc(100% - 2px);
      left: 50%;
      padding-top: 6px;
      transform: translateX(-50%);

      &::after {
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #e4e4e4;
        top: -2px;
        left: 50%;
        transform: translateX(-50%);
      }
    `};

  ${props =>
    props.position === 'top' &&
    css`
      bottom: calc(100% - 2px);
      left: 50%;
      padding-bottom: 4px;
      transform: translateX(-50%);

      &::after {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #e4e4e4;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
      }
    `};

  ${props =>
    props.position === 'right' &&
    css`
      top: 50%;
      left: calc(100% - 2px);
      padding-left: 4px;
      transform: translateY(-50%);

      &::after {
        border-right: 4px solid #e4e4e4;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        top: 50%;
        left: -2px;
        transform: translateY(-50%);
      }
    `};

  ${props =>
    props.position === 'left' &&
    css`
      top: 50%;
      right: calc(100% - 2px);
      padding-right: 4px;
      transform: translateY(-50%);

      &::after {
        border-left: 4px solid #e4e4e4;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        top: 50%;
        right: -2px;
        transform: translateY(-50%);
      }
    `};

  & > div {
    background-color: #e4e4e4;
    font-size: 11.1px;
    line-height: 1.4;
    text-align: center;
    font-weight: 700;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #282e39;
    padding: 9px 0px;
    border-radius: 4px;
  }
`

const Tooltip: React.FC<Props> = props => {
  const { message, children, position } = props
  const [show, setShow] = useState(false)
  const hideTooltip = () => setShow(false)
  const showTooltip = () => setShow(true)

  return (
    <TooltipContainer onMouseLeave={hideTooltip} onMouseOver={showTooltip}>
      {show && (
        <TooltipBubble position={position} message={message}>
          <div>{message}</div>
        </TooltipBubble>
      )}
      {children}
    </TooltipContainer>
  )
}

TooltipBubble.defaultProps = {
  position: 'bottom',
}

export default Tooltip
