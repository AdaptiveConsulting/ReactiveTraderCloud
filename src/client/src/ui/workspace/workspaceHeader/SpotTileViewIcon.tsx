import React, { FC } from 'react'
import { styled } from 'rt-theme'
import { IconWrapper, Rect } from './styled'

const FirstRect = styled(Rect)`
  margin-right: 2px;
`

const Hr = styled.hr`
  width: 80%;
  margin: 0 auto;
  height: 2px;
  background-color: ${({ theme }) => theme.core.textColor};
  margin-top: 2px;
`

const SpotTileViewIcon: FC = () => (
  <div>
    <IconWrapper>
      <FirstRect />
      <Rect />
    </IconWrapper>
    <Hr />
  </div>
)

export default SpotTileViewIcon
