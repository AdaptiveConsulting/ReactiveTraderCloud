import React from 'react'
import { styled } from 'rt-theme'

export const StyledButton = styled.button`
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
  border: 0.5px solid ${({ theme }) => theme.core.darkBackground};

  background-color: ${({ theme }) => theme.core.alternateBackground};

  .svg-fill {
    fill: ${({ theme }) => theme.core.textColor};
  }

  .svg-stroke {
    stroke: ${({ theme }) => theme.core.textColor};
  }

  &:hover {
    background-color: ${({ theme }) => theme.button.dominant.backgroundColor};
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
