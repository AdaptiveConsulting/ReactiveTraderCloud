import { FC } from "react"
import { Fill, Header, Root } from "./styled"

const StatusBar: FC = ({ children }) => (
  <Root role="contentinfo" aria-label="Reactive Trader Meta">
    <Header>
      <Fill size={1} aria-hidden={true} />
      {children}
    </Header>
  </Root>
)

export default StatusBar
