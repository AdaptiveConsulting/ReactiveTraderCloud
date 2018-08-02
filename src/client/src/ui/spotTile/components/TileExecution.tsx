import React from 'react'
import { styled } from 'rt-util'

const TileExecutionStyle = styled('div')`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const ExecutionPill = styled('div')`
  background-color: ${({ theme: { palette } }) => palette.accentPrimary.normal};
  color: ${({ theme: { text } }) => text.white};
  padding: 10px 16px;
  border-radius: 17px;
  font-size: 13px;
  box-shadow: 0 0 30px ${({ theme: { palette } }) => palette.accentPrimary.normal},
    0 0 10px ${({ theme: { palette } }) => palette.accentPrimary.dark};
`

const TileExecution = () => (
  <TileExecutionStyle>
    <ExecutionPill>[LOGO] Executing</ExecutionPill>
  </TileExecutionStyle>
)

export default TileExecution
