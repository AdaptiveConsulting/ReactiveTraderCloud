import React, { useCallback, useState } from 'react'
import ExternalWindow, { ExternalWindowProps } from './ExternalWindow'
import { styled } from 'rt-theme'
import { LayoutActions } from 'apps/MainRoute/layouts/layoutActions'
import { useDispatch } from 'react-redux'
import { usePlatform } from 'rt-components'

type RenderCB = (popOut: (notional: string) => any, tornOff: boolean, defaultNotional?: string) => JSX.Element

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
  defaultNotional?: string
  externalWindowProps: Partial<ExternalWindowProps>
  tornOff: boolean
  x?: number
  y?: number
  dragTearOff: boolean
}

const TearOff: React.FC<TearOffProps> = props => {
<<<<<<< HEAD
  const { allowTearOff } = usePlatform()
=======
  const [defaultNotional, setDefaultNotional] = useState('')
>>>>>>> Persist notional on pop-up
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
  const popOutWithNotional = (popOut: any) => {
    return (notional: string) => {
      return (x: number, y: number) => {
        setDefaultNotional(notional);
        popOut(x, y);
      }
    }
  }
  const returnNotional = (notional: string) => {
    setDefaultNotional(notional)
  }

  const popIn = useCallback(
    () =>
      dispatch(LayoutActions.updateContainerVisibilityAction({ name: windowName, display: true })),
    [windowName, dispatch],
  )

  if (tornOff) {
    return <ExternalWindow onUnload={popIn} defaultNotional={defaultNotional} returnNotional={returnNotional} {...externalWindowProps} />
  }

  if (dragTearOff) {
    return (
      <DragWrapper
        draggable={allowTearOff}
        onDragEnd={(event: React.DragEvent<HTMLDivElement>) => {
          const input = event.currentTarget.querySelector('input')
          const notional = input.getAttribute('value') || '$0'
          popOutWithNotional(popOut)(notional)(event.screenX, event.screenY)
        }}
        onDragStart={onDragStart}
      >
        {render(popOutWithNotional(popOut), tornOff, defaultNotional)}
      </DragWrapper>
    )
  }
  return render(popOutWithNotional(popOut), tornOff, defaultNotional)
}

export default TearOff
