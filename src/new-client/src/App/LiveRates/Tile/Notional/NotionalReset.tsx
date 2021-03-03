import React from "react"
import { FaRedo } from "react-icons/fa"
import styled from "styled-components/macro"
import { useRfqState, QuoteState } from "../Rfq"
import {
  DEFAULT_NOTIONAL,
  onChangeNotionalValue,
  useNotional,
} from "../Tile.state"

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

export const NotionalReset: React.FC<{ symbol: string }> = ({ symbol }) => {
  const notional = useNotional(symbol)
  const { state: quoteState } = useRfqState()
  return quoteState !== QuoteState.Received &&
    notional !== String(DEFAULT_NOTIONAL) ? (
    <ResetInputValue
      onClick={(e) => {
        e.stopPropagation()
        onChangeNotionalValue({
          symbol,
          value: DEFAULT_NOTIONAL.toString(),
        })
      }}
    >
      <FaRedo className="flipHorizontal" />
    </ResetInputValue>
  ) : null
}
