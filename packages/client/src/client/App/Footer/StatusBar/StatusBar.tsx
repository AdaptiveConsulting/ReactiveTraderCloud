import { WithChildren } from "@/client/utils/utilityTypes"

import { Root } from "./styled"

const StatusBar = ({ children }: WithChildren) => (
  <Root role="contentinfo" aria-label="Reactive Trader Meta">
    {children}
  </Root>
)

export default StatusBar
