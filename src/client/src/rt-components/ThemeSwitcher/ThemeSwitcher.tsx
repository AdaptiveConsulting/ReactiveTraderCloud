import React from 'react'
import Ink from 'react-ink'

import { styled } from 'rt-util'
import { Themes } from 'shell/theme'

interface IconButtonProps {
  type: 'primary' | 'secondary'
}
const IconButton = styled('div')<IconButtonProps>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${({ theme }) => theme.animationSpeed.normal}ms;
  cursor: pointer;
  position: relative;
  will-change: background-color;
  &&:hover {
    background-color: ${({ theme, type }) => theme.palette[type][1]};
  }
  > i {
    font-size: ${({ theme }) => theme.fontSize.h2};
  }
`

interface Props {
  toggleTheme: () => void
  theme: Themes
  type?: 'primary' | 'secondary'
}

const ThemeSwitcher: React.SFC<Props> = ({ theme, toggleTheme, type }) => (
  <IconButton onClick={toggleTheme} type={type || 'primary'}>
    <Ink />
    <i className={`fa${theme === Themes.LIGHT_THEME ? 'r' : 's'} fa-lightbulb`} />
  </IconButton>
)

export default ThemeSwitcher
