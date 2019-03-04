import React, { FC } from 'react'
import { styled } from 'rt-theme'
import numeral from 'numeral'

interface ToolTipProps {
  payload: any[]
}

export const ToolTipStyle = styled.div`
  background-color: #14161c;
  width: 100px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ToolTipChildRight = styled.div`
  width: 30px;
  font-size: 10px;
  color: ${({ theme }) => theme.template.white.normal};
`

const AnalyticsTileTooltip: FC<ToolTipProps> = ({ payload }) => {
  return (
    <ToolTipStyle>
      <ToolTipChildRight>{payload.length > 0 && numeral(payload[0].value).format('0.00a')}</ToolTipChildRight>
    </ToolTipStyle>
  )
}

export default AnalyticsTileTooltip
