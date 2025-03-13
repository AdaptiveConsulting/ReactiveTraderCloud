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
    case SellSideQuoteState.Passed:
      return theme.color["Component colors/Utility/Error/utility-error-400"] // TODO talk to UX about getting a more semantic color for passed
    case SellSideQuoteState.Pending:
      return theme.color["Colors/Background/bg-warning-secondary"]
    case SellSideQuoteState.New:
      return theme.color["Colors/Background/bg-warning-primary"]
    case SellSideQuoteState.Cancelled:
    case SellSideQuoteState.Expired:
    default:
      return theme.color["Colors/Background/bg-disabled"]
  }
}
