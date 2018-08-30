import React from 'react'
import { Root } from './styled'

interface Props {
  renderContent: () => JSX.Element
}

const Sidebar: React.SFC<Props> = ({ renderContent }) => {
  return <Root>{renderContent()}</Root>
}

export default Sidebar
