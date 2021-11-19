import styled from "styled-components"
import React, { RefObject, useContext, useState } from "react"
import { TearOutContext } from "@/App/TearOutSection/tearOutContext"
import { tearOutSection, Section } from "@/App/TearOutSection/state"
import { canDrag } from "@/components/DraggableComponent/canDrag"
import { tearOut } from "@/App/LiveRates/Tile/TearOut/state"

interface DraggableComponentProps {
  children: JSX.Element[] | JSX.Element
  section: Section
  isTile?: boolean
  ref?: RefObject<HTMLDivElement>
  isTornOut?: boolean
  symbol?: string
}

export const DraggableComponent: React.FC<DraggableComponentProps> = (
  props: DraggableComponentProps,
) => {
  //stopPropagation() is not enough to avoid the parent (in case we are dragging a Tile) also tearing out
  //this state makes sure that the drag event started and finished succesfully
  const [finishedDrag, setFinishedDrag] = useState(false)

  const tearOutContext = useContext(TearOutContext)
  const symbol = props.symbol ? props.symbol : ""
  const ref = props.ref ? props.ref : { current: null }

  const eventHandler = (event: React.DragEvent) => {
    props.isTile
      ? tearOut(symbol, !props.isTornOut, ref.current!)
      : tearOutSection(!tearOutContext.isTornOut, props.section)
  }

  return (
    <DragWrapper
      draggable={canDrag}
      onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
        createDragImage(event, setFinishedDrag)
      }
      onDragEnd={(event: React.DragEvent<HTMLDivElement>) =>
        finishedDrag && eventHandler(event)
      }
      data-qa="tear-off__drag-wrapper"
    >
      {props.children}
    </DragWrapper>
  )
}
const createDragImage = (
  event: React.DragEvent<HTMLDivElement>,
  callback: any,
) => {
  event.stopPropagation()
  const eventTarget = event.target as HTMLDivElement
  event.dataTransfer.setData("text/plain", eventTarget.id)
  const dt = event.dataTransfer
  const clientRect = eventTarget.getBoundingClientRect()
  const y = clientRect.top
  const x = clientRect.left
  if (typeof dt.setDragImage === "function") {
    const node = event.currentTarget.cloneNode(true) as HTMLDivElement
    node.classList.add("tearOff")
    node.style.top = `${Math.max(0, y)}px`
    node.style.left = `${Math.max(0, x)}px`
    node.style.position = "absolute"
    node.style.pointerEvents = "none"
    node.style.opacity = "1"

    node.style.width = clientRect.width + "px"
    node.style.height = clientRect.height + "px"

    document.body.appendChild(node)

    const offsetX = event.clientX - clientRect.left
    const offsetY = event.clientY - clientRect.top

    dt.setDragImage(node, offsetX, offsetY)
    callback(true)
    setTimeout(function () {
      node.remove()
    })
  }
}

export const DragWrapper = styled.div`
  height: 100%;
`
