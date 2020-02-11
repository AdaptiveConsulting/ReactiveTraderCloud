import React from 'react'
import { styled } from 'rt-theme'

const StyledButton = styled.button`
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  z-index: 100;

  border-radius: 4px;
  background-color: #313131;

  .svg-fill {
    fill: ${({ theme }) => theme.core.textColor};
  }

  .svg-stroke {
    stroke: ${({ theme }) => theme.core.textColor};
  }

  &:hover {
    background-color: #2b2b2b;
    svg {
      transition-timing-function: ease-out;
      transition: transform 0.3s;
      transform: translateY(-20%);
    }
  }
`

interface LaunchButtonProps {
  onClick: () => void
  children: JSX.Element[] | JSX.Element
}

export const LaunchButton = (props: LaunchButtonProps) => (
  <StyledButton onClick={props.onClick}>{props.children}</StyledButton>
)
