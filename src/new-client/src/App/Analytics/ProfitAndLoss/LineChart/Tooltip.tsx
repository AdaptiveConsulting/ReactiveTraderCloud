import styled from "styled-components/macro"

const ToolTipStyle = styled.div`
  background-color: #14161c;
  width: 120px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ToolTipChildLeft = styled.div`
  width: 70px;
  opacity: 0.6;
  font-size: 10px;
  color: ${({ theme }) => theme.white};
`
const ToolTipChildRight = styled.div`
  width: 30px;
  font-size: 10px;
  color: ${({ theme }) => theme.white};
`

/*
export const CustomTooltip: React.FC<ToolTipProps> = ({ payload, label }) => {
  return (
    <ToolTipStyle>
      <ToolTipChildLeft>{label}</ToolTipChildLeft>
      <ToolTipChildRight>
        {payload.length > 0 &&
          formatWithScale(payload[0].value, formatToPrecision1)}
      </ToolTipChildRight>
    </ToolTipStyle>
  )
}
 */

export {}
