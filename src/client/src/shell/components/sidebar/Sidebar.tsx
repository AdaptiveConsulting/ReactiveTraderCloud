import React from 'react'
import { RegionContent, Root } from './styled'

interface Props {
  renderContent: () => JSX.Element
}

const Sidebar: React.SFC<Props> = ({ renderContent }) => {
  return (
    <Root>
      <RegionContent>{renderContent()}</RegionContent>
    </Root>
  )
}

export default Sidebar
