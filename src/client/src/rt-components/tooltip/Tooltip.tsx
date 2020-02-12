import React, { useState } from 'react'
import { css } from 'styled-components'
import { styled } from 'rt-theme'

interface Props {
  position?: 'top' | 'bottom' | 'left' | 'right'
  message?: string
}

const TooltipContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const TooltipBubble = styled.div<Props>`
  min-width: 120px;
  max-width: 210px;
  position: absolute;
  z-index: 1000;

  &::after {
    content: '';
    position: absolute;
  }

  ${props =>
    props.position === 'bottom' &&
    css`
      top: 100%;
      left: 50%;
      padding-top: 4px;
      transform: translateX(-50%);

      &::after {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #e4e4e4;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    `};

  ${props =>
    props.position === 'top' &&
    css`
      bottom: 100%;
      left: 50%;
      padding-bottom: 4px;
      transform: translateX(-50%);

      &::after {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #e4e4e4;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    `};

  ${props =>
    props.position === 'right' &&
    css`
      top: 50%;
      left: 100%;
      padding-left: 4px;
      transform: translateY(-50%);

      &::after {
        border-right: 4px solid #e4e4e4;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    `};

  ${props =>
    props.position === 'left' &&
    css`
      top: 50%;
      right: 100%;
      padding-right: 4px;
      transform: translateY(-50%);

      &::after {
        border-left: 4px solid #e4e4e4;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    `};

  & > div {
    background-color: #e4e4e4;
    border-radius: 3px;
    font-size: 0.75rem;
    line-height: 1.4;
    padding: 0.75em;
    text-align: center;
    font-weight: 700;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #282e39;
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
        <TooltipBubble position={position}>
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
