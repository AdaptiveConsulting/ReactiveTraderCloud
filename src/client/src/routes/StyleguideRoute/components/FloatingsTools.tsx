import React from 'react'
import Switch from 'react-switch'

import { colors, styled, ThemeName } from 'rt-theme'

import { Block } from '../styled'

export interface Props {
  themeName?: string
  switchTheme: () => void
}
export const FloatingTools: React.SFC<Props> = ({ themeName, switchTheme }) => {
  const isDark = themeName === ThemeName.Dark

  const { primary, secondary } = colors[themeName]

  return (
    <Root>
      <Bar>
        <Label>Switch to {isDark ? 'Light' : 'Dark'} mode </Label>
        <Switch
          className="switch"
          onChange={switchTheme}
          checked={isDark}
          checkedIcon={false}
          uncheckedIcon={false}
          height={12}
          width={32}
          handleDiameter={18}
          offColor={secondary[4]}
          offHandleColor={secondary.base}
          onColor={primary.base}
          onHandleColor={primary[2]}
        />
      </Bar>
    </Root>
  )
}

const Root: React.SFC = props => <Block backgroundColor="primary.2" {...props} />

const Bar = styled(props => <Block px={3} backgroundColor="primary.1" textColor="secondary.3" {...props} />)`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  opacity: 0.85;
  min-height: 2.5rem;
  max-height: 2.5rem;
`

const Label = styled.label`
  text-transform: uppercase;
  letter-spacing: 0.0625rem;
  font-size: 0.5rem;
  padding-right: 0.5rem;
  text-align: right;
`

export default FloatingTools
