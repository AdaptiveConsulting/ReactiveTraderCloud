import React from 'react'
import { styled } from 'rt-theme'

const StyledButton = styled.button<{ fill?: string; active?: boolean }>`
  width: 40px;
  height: ${({ active }) => (active ? '40px' : '45px')};
  font-size: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;

  border-radius: 4px;
  background-color: ${({ fill, active }) => (active ? fill : 'inherited')};

  &:hover {
    height: 45px;
    background-color: ${({ fill }) => fill};
    justify-content: ${({ title }) => (title === 'Search ecosystem' ? 'center' : 'start')};
    padding-top: ${({ title }) =>
      title === 'Search ecosystem' ? '0' : title === 'Launch Excel' ? '2.5px' : '6px'};
  }
`

interface LaunchButtonProps {
  onClick: () => void
  fill?: string
  children: JSX.Element[] | JSX.Element
  title?: string
  active?: boolean
}

export const LaunchButton = (props: LaunchButtonProps) => (
  <StyledButton title={props.title} onClick={props.onClick} fill={props.fill} active={props.active}>
    {props.children}
  </StyledButton>
)
