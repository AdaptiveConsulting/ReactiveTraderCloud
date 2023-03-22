import { DefaultTheme } from "styled-components"

import { SellSideQuoteState } from "../sellSideState"

export const getSellSideStatusColor = (
  status: SellSideQuoteState,
  theme: DefaultTheme,
) => {
  switch (status) {
    case SellSideQuoteState.Accepted:
      return theme.accents.positive.base
    case SellSideQuoteState.Lost:
    case SellSideQuoteState.Rejected:
    case SellSideQuoteState.Passed:
      return theme.accents.negative.base
    case SellSideQuoteState.Pending:
      return theme.accents.aware.medium as string
    case SellSideQuoteState.New:
      return theme.accents.aware.darker
    case SellSideQuoteState.Cancelled:
    case SellSideQuoteState.Expired:
    default:
      return theme.colors.dark.primary[4]
  }
}
