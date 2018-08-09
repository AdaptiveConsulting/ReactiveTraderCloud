import React from 'react'
import styled from 'react-emotion'

import { Themes } from 'shell/theme'

const IconButton = styled('div')<{ [key: string]: any }>`
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  cursor: pointer;

  transition: background-color ${({ theme }) => theme.motion.duration}ms ${({ theme }) => theme.motion.easing};

  &:hover {
    background-color: ${({ theme }) => theme.button.secondary.active.backgroundColor};
    color: ${({ theme }) => theme.button.secondary.textColor};
  }
`

interface Props {
  toggleTheme: () => void
  theme: Themes
  type?: 'primary' | 'secondary'
}

const ThemeSwitcher: React.SFC<Props> = ({ theme, toggleTheme, type }) => (
  <IconButton onClick={toggleTheme} type={type || 'primary'}>
    <i className={`fa${theme === Themes.LIGHT_THEME ? 'r' : 's'} fa-lightbulb`} />
  </IconButton>
)

export default ThemeSwitcher
