import { WithChildren } from "client/utils/utilityTypes"

import { Fill, Header, Root } from "./styled"

const StatusBar = ({ children }: WithChildren) => (
  <Root role="contentinfo" aria-label="Reactive Trader Meta">
    <Header>
      <Fill size={1} aria-hidden={true} />
      {children}
    </Header>
  </Root>
)

export default StatusBar
