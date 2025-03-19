import { DefaultTheme } from "styled-components"

import { SellSideQuoteState } from "../sellSideState"

export const getSellSideStatusColor = (
  status: SellSideQuoteState,
  theme: DefaultTheme,
) => {
  switch (status) {
    case SellSideQuoteState.Accepted:
      return theme.color["Component colors/Utility/Success/utility-success-400"]
    case SellSideQuoteState.Lost:
    case SellSideQuoteState.Rejected:
      return theme.color["Component colors/Utility/Error/utility-error-400"] // TODO talk to UX about getting a more semantic color for passed
    case SellSideQuoteState.Pending:
      return theme.color["Colors/Border/border-warning_subtle"]
    case SellSideQuoteState.New:
      return theme.color["Colors/Border/border-warning"]
    case SellSideQuoteState.Passed:
    case SellSideQuoteState.Cancelled:
    case SellSideQuoteState.Expired:
    default:
      return theme.color["Colors/Border/border-disabled"]
  }
}
