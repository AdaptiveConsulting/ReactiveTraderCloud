import React from 'react'
import styled, { css } from 'react-emotion'

const Icon = ({ name, ...props }) => (
  <div {...props}>
    <i className={`fas fa-${name}`} />
  </div>
)

export default styled(Icon)`
  ${({ size = 1.5 }) => css`
    min-width: ${size}rem;
    max-width: ${size}rem;
    min-height: ${size}rem;
    max-height: ${size}rem;
  `};

  line-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: ${props => props.theme.backgroundColor || 'inherit'};
  color: ${props => props.theme.textColor || 'inherit'};
`
