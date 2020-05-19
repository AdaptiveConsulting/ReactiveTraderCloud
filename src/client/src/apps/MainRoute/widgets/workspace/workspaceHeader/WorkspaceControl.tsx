import React, { FC, useCallback, MouseEvent } from 'react'
import { PopoutIcon } from 'rt-components'
import { styled } from 'rt-theme'

interface WorkspaceControlProps {
  onPopoutClick?: (x: number, y: number) => void
}

const WorkspaceControl: FC<WorkspaceControlProps> = props => {
  const { onPopoutClick } = props

  const handlePopoutClick = useCallback(
    (e: MouseEvent) => {
      onPopoutClick && onPopoutClick(e.screenX, e.screenY)
    },
    [onPopoutClick]
  )

  return <PopoutButton onClick={handlePopoutClick}>{PopoutIcon}</PopoutButton>
}

const PopoutButton = styled('button')`
  &:hover {
    .hover-state {
      fill: #5f94f5;
    }
  }
`

export default WorkspaceControl
