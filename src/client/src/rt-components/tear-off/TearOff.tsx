import React, { useCallback } from 'react'
import ExternalWindow, { ExternalWindowProps } from './ExternalWindow'
import { styled } from 'rt-theme'
import { useDispatch } from 'react-redux'
import { usePlatform } from 'rt-platforms'
import { LayoutActions } from 'rt-actions'

type RenderCB = (popOut: (x?: number, y?: number) => void, tornOff: boolean) => JSX.Element

const DragWrapper = styled.div`
  height: 100%;
`
/* 
  we create a clone of the dragged node, set some styles and add it to the DOM
  we set the drag image to this node then remove it in a timeout
*/

const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
  const eventTarget = event.target as HTMLDivElement
  event.dataTransfer.setData('text/plain', eventTarget.id)
  const dt = event.dataTransfer

  const clientRect = eventTarget.getBoundingClientRect()
  const y = clientRect.top
  const x = clientRect.left
  if (typeof dt.setDragImage === 'function') {
    const node = event.currentTarget.cloneNode(true) as HTMLDivElement
    node.classList.add('tearOff')
    node.style.top = `${Math.max(0, y)}px`
    node.style.left = `${Math.max(0, x)}px`
    node.style.position = 'absolute'
    node.style.pointerEvents = 'none'
    node.style.opacity = '1'

    node.style.width = clientRect.width + 'px'
    node.style.height = clientRect.height + 'px'

    document.body.appendChild(node)

    const offsetX = event.clientX - clientRect.left
    const offsetY = event.clientY - clientRect.top

    dt.setDragImage(node, offsetX, offsetY)
    setTimeout(function() {
      node.remove()
    })
  }
}

export interface TearOffProps {
  id: string
  render: RenderCB
  externalWindowProps: Partial<ExternalWindowProps>
  tornOff: boolean
  x?: number
  y?: number
  dragTearOff: boolean
}

const TearOff: React.FC<TearOffProps> = props => {
  const { allowTearOff } = usePlatform()
  const dispatch = useDispatch()
  const { render, externalWindowProps, tornOff, dragTearOff } = props
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

  if (tornOff) {
    return <ExternalWindow onUnload={popIn} {...externalWindowProps} />
  }

  if (dragTearOff) {
    return (
      <DragWrapper
        draggable={allowTearOff}
        onDragEnd={(event: React.DragEvent<HTMLDivElement>) => {
          popOut(event.screenX, event.screenY)
        }}
        onDragStart={onDragStart}
        data-qa="tear-off__drag-wrapper"
      >
        {render(popOut, tornOff)}
      </DragWrapper>
    )
  }
  return render(popOut, tornOff)
}

export default TearOff
