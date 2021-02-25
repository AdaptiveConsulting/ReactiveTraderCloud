import { createListener } from "@react-rxjs/utils"
import React from "react"
import { FaRedo } from "react-icons/fa"
import styled from "styled-components/macro"
import { DEFAULT_NOTIONAL, onChangeNotionalValue } from "../Tile.state"
import { useIsRfq } from "./Rfq.state"

const ResetInputValue = styled.button`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  border-radius: 3px;
  margin-left: 8px;
  grid-area: ResetInputValue;
  cursor: pointer;
  font-size: 0.625rem;
  line-height: 1.2rem;

  .flipHorizontal {
    transform: scaleX(-1);
  }
`

const [notionalResets$, onNotionalReset] = createListener<string>()

notionalResets$.subscribe((symbol) => {
  onChangeNotionalValue({
    symbol,
    value: DEFAULT_NOTIONAL.toString(),
  })
})

export { notionalResets$ }

export const NotionalReset: React.FC<{ symbol: string }> = ({ symbol }) => {
  const isRfq = useIsRfq()
  return isRfq ? (
    <ResetInputValue
      onClick={(e) => {
        e.stopPropagation()
        onNotionalReset(symbol)
      }}
    >
      <FaRedo className="flipHorizontal" />
    </ResetInputValue>
  ) : null
}
