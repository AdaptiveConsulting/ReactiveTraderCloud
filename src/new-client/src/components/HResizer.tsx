import { useState, useRef } from "react"
import {
  ResizableSection,
  ResizerStyle,
  ResizableContentHoritzontal,
  ResizableContent,
  Bar,
} from "./Resizer.styles"

interface Props {
  children: [React.ReactNode, React.ReactNode]
  minwidth?: number
  defaultWidth: number
}

const HResizer: React.FC<Props> = ({ defaultWidth, children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [width, setwidth] = useState(defaultWidth)

  const startDragging = useRef<() => void>()
  if (!startDragging.current) {
    startDragging.current = () => {
      const setClientwidth = (clientX: number) => {
        const wrapperElement = wrapperRef.current
        if (!wrapperElement) return

        // Calculate the width of the bottom div based on cursor position
        const wrapperwidth = wrapperElement.offsetWidth
        const wrapperTop = wrapperElement.offsetTop
        const wrapperOffset = clientX - wrapperTop
        const rawwidth = wrapperwidth - wrapperOffset
        // Calculate width as a percentage of parent
        let width = Math.round((rawwidth / wrapperwidth) * 100)

        // Block widths that would completely overlap left div
        if (width > 65) width = 65

        // Block widths that would hide left div
        if (width < 20) width = 20

        setwidth(width)
      }

      const handleMouseMove = (event: MouseEvent) =>
        setClientwidth(event.clientX)
      const handleTouchMove = (event: TouchEvent) =>
        setClientwidth(event.touches[0].clientX)
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
    <ResizerStyle horitzontalResize={true} ref={wrapperRef}>
      {children[0] && (
        <ResizableSection
          horitzontalResize={true}
          width={children[1] ? 100 - width : 100}
        >
          <ResizableContent horitzontalResize={true}>
            {children[0]}
          </ResizableContent>
          {children[1] && (
            <Bar
              onMouseDown={startDragging.current!}
              onTouchStart={startDragging.current!}
              show
              horitzontalResize={true}
            />
          )}
        </ResizableSection>
      )}
      {children[1] && (
        <ResizableSection
          horitzontalResize={true}
          width={children[0] ? width : 100}
        >
          <ResizableContentHoritzontal>
            {children[1]}
          </ResizableContentHoritzontal>
        </ResizableSection>
      )}
    </ResizerStyle>
  )
}

export default HResizer
