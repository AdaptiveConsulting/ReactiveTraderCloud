import React from 'react'

import { styled } from 'rt-util'

// const DEFAULT_WIDTH = 200

interface StyledSidePanelProps {
  width: string
}
const StyledSidePanel = styled('div')<StyledSidePanelProps>`
  height: 100%;
  width: ${({ width }) => width};
  box-shadow: ${({ theme }) => theme.shadow['1']};
  background-color: grey;
`

interface Props {
  width?: string
}

const SidePanel: React.SFC<Props> = ({ children, width }) => (
  <StyledSidePanel width={width || '300px'}>{children}</StyledSidePanel>
)

export default SidePanel
