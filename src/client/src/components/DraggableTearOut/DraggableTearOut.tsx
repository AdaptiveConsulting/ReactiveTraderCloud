import styled from "styled-components"
import { RefObject, useState } from "react"
import { tearOutSection, Section } from "@/App/TearOutSection/state"
import { supportsDragToTearOut } from "@/components/DraggableTearOut/supportsDragToTearOut"
import { tearOut } from "@/App/LiveRates/Tile/TearOut/state"

export const DragWrapper = styled.div`
  height: 100%;
`

type DraggableSectionTearOutProps = React.PropsWithChildren<{
  section: Section
  disabled?: boolean
}>

type DraggableTileTearOutProps = React.PropsWithChildren<{
  symbol: string
  tileRef: RefObject<HTMLDivElement>
  disabled?: boolean
}>

type DraggableTearOutGenericProps = React.PropsWithChildren<{
  dragHandler: () => void
}>

export const DraggableSectionTearOut: React.FC<DraggableSectionTearOutProps> = (
  props,
) => {
  const draggable = supportsDragToTearOut && !props.disabled
  const dragHandler = () => {
    tearOutSection(true, props.section)
  }
  return draggable ? (
    <DraggableTearOut dragHandler={dragHandler}>
      {props.children}
    </DraggableTearOut>
  ) : (
    <>{props.children}</>
  )
}

export const DraggableTileTearOut: React.FC<DraggableTileTearOutProps> = (
  props,
) => {
  const draggable = supportsDragToTearOut && !props.disabled
  const dragHandler = () => {
    tearOut(props.symbol, true, props.tileRef.current!)
  }
  return draggable ? (
    <DraggableTearOut dragHandler={dragHandler}>
      {props.children}
    </DraggableTearOut>
  ) : (
    <>{props.children}</>
  )
}

export const DraggableTearOut: React.FC<DraggableTearOutGenericProps> = (
  props,
) => {
  const [finishedDrag, setFinishedDrag] = useState(false)
  return (
    <DragWrapper
      draggable={true}
      onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
        createDragImage(event, setFinishedDrag)
      }
      onDragEnd={(event: React.DragEvent<HTMLDivElement>) =>
        finishedDrag && props.dragHandler()
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
