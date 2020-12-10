import React, { FC } from "react"
import { Fill, Header, Root } from "./styled"

const StatusBar: FC = ({ children }) => (
  <Root>
    <Header>
      <Fill size={1} />
      {children}
    </Header>
  </Root>
)

export default StatusBar
