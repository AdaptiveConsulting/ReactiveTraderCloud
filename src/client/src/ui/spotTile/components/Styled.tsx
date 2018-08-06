import React from 'react'
import { styled } from 'rt-util'

export interface ColorProps {
  color?: string
  bg?: string
}

export const DeliveryDate = styled('div')`
  color: ${({ theme: { text } }) => text.textMeta};
  font-size: 10px;

  ._spot-tile:hover & {
    color: ${({ theme: { text } }) => text.textPrimary};
  }
`

export const TileSymbol = styled('div')`
  color: ${({ theme: { text } }) => text.textPrimary};
  font-size: 13px;
`

export const TileBaseStyle = styled('div')`
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: 18px;
  box-sizing: border-box;
`

export const Icon = styled('i')<ColorProps>`
  color: ${({ theme: { text }, color }) => text[color]};
`

export const Button = styled('button')`
  font-family: Lato;
  border: none;
`

export const CircleButton = styled(Button)`
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  width: 34px;
  height: 34px;
  border-radius: 50%;
  text-align: center;
`

interface IconButtonProps {
  icon: string
  handleClick?: () => void
}

export const IconButton = ({ icon, handleClick }: IconButtonProps) => (
  <CircleButton>
    <Icon className={icon} aria-hidden="true" color="textMeta" onClick={handleClick} />
  </CircleButton>
)
