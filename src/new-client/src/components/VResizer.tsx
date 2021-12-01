import { useState, useRef } from "react"
import {
  ResizableSection,
  ResizerStyle,
  ResizableContent,
  Bar,
} from "./Resizer.styles"

interface Props {
  children: [React.ReactNode, React.ReactNode]
  minHeight?: number
  defaultHeight: number
}

const VResizer: React.FC<Props> = ({ defaultHeight, children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(defaultHeight)

  const startDragging = useRef<() => void>()
  if (!startDragging.current) {
    startDragging.current = () => {
      const setClientHeight = (clientY: number) => {
        const wrapperElement = wrapperRef.current
        if (!wrapperElement) return

        // Calculate the height of the bottom div based on cursor position
        const wrapperHeight = wrapperElement.offsetHeight
        const wrapperTop = wrapperElement.offsetTop
        const wrapperOffset = clientY - wrapperTop
        const rawHeight = wrapperHeight - wrapperOffset
        // Calculate height as a percentage of parent
        let height = Math.round((rawHeight / wrapperHeight) * 100)

        // Block heights that would completely overlap top div
        if (height > 90) height = 90

        // Block heights that would hide bottom div
        if (height < 10) height = 10

        setHeight(height)
      }

      const handleMouseMove = (event: MouseEvent) =>
        setClientHeight(event.clientY)
      const handleTouchMove = (event: TouchEvent) =>
        setClientHeight(event.touches[0].clientY)
      const handleStop = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("mouseup", handleStop)
        document.removeEventListener("touchend", handleStop)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("mouseup", handleStop, { once: true })
      document.addEventListener("touchend", handleStop, { once: true })
    }
  }

  return (
    <ResizerStyle ref={wrapperRef}>
      {children[0] && (
        <ResizableSection height={children[1] ? 100 - height : 100}>
          <ResizableContent>{children[0]}</ResizableContent>
        </ResizableSection>
      )}
      {children[1] && (
        <ResizableSection height={children[0] ? height : 100}>
          <ResizableContent>
            {children[0] && (
              <Bar
                onMouseDown={startDragging.current!}
                onTouchStart={startDragging.current!}
                show
              />
            )}
            {children[1]}
          </ResizableContent>
        </ResizableSection>
      )}
    </ResizerStyle>
  )
}

export default VResizer
