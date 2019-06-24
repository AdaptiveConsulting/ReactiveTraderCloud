import React, { useMemo, useCallback } from 'react'
import ExternalWindow, { ExternalWindowProps } from './ExternalWindow'
import { styled } from 'rt-theme'
import { LayoutActions } from '../../shell/layouts/layoutActions'
import { useDispatch } from 'react-redux'
import { withDrag, tilesAreDraggabe } from './../../ui/drag/drag'

type RenderCB = (popOut: (x?: number, y?: number) => void, tornOff: boolean) => JSX.Element

const DragWrapper = styled.div`
  height: 100%;
`

export interface TearOffProps {
  id: string
  render: RenderCB
  externalWindowProps: Partial<ExternalWindowProps>
  tornOff: boolean
  x?: number
  y?: number
}

const TearOff: React.FC<TearOffProps> = props => {
  const dispatch = useDispatch()
  const { render, externalWindowProps, tornOff } = props
  const windowName = externalWindowProps.config.name
  const popOut = useCallback(
    (x: number, y: number) =>
      dispatch(
        LayoutActions.updateContainerVisibilityAction({ name: windowName, display: false, x, y }),
      ),
    [windowName],
  )
  const popIn = useCallback(
    () =>
      dispatch(LayoutActions.updateContainerVisibilityAction({ name: windowName, display: true })),
    [windowName, dispatch],
  )
  const drag = useMemo(withDrag, [])

  if (tornOff) {
    return <ExternalWindow onUnload={popIn} {...externalWindowProps} />
  }

  return (
    <DragWrapper
      draggable={tilesAreDraggabe}
      onDragEnd={(event: React.DragEvent<HTMLDivElement>) => {
        drag.onDragEnd(event, popOut)
      }}
      onDragStart={drag.onDragStart}
      onDrag={drag.onDrag}
    >
      {render(popOut, tornOff)}
    </DragWrapper>
  )
}

export default TearOff
