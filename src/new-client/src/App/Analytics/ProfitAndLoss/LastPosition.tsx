import { bind } from "@react-rxjs/core"
import styled from "styled-components"
import { history$ } from "@/services/analytics"
import { map } from "rxjs/operators"
import { formatAsWholeNumber } from "@/utils/formatNumber"

type Accents = "positive" | "negative"

const USDspan = styled.span`
  opacity: 0.6;
  font-size: 14px;
  margin-right: 10px;
`
const LastPositionStyle = styled.span<{ color: Accents }>`
  font-size: 14px;
  color: ${({ theme, color }) => theme.accents[color].base};
`

const [useLastPosition, lastPosition$] = bind(
  history$.pipe(map((history) => history[history.length - 1]?.usPnl ?? 0)),
)

export const LastPosition: React.FC = () => {
  const lastPos = useLastPosition()
  const lastPosStr = `${lastPos >= 0 ? "+" : ""}${formatAsWholeNumber(lastPos)}`

  return (
    <div>
      <USDspan>USD</USDspan>
      <LastPositionStyle color={lastPos >= 0 ? "positive" : "negative"}>
        {lastPosStr}
      </LastPositionStyle>
    </div>
  )
}

export { lastPosition$ }
