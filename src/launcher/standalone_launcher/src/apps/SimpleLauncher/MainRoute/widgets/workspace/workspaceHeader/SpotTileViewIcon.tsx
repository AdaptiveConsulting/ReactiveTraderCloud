import React, { FC } from 'react'
import styled from 'styled-components/macro'
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
  <>
    <IconWrapper>
      <FirstRect />
      <Rect />
    </IconWrapper>
    <Hr />
  </>
)

export default SpotTileViewIcon
