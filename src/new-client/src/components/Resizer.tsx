import { useState, useRef } from "react"
import styled from "styled-components"

const ResizerStyle = styled.div`
  width: 100%;
  height: 100%;
`

const ResizableSection = styled.div<{ height: number }>`
  height: ${({ height }) => height + "%"};
  overflow: hidden;
  position: relative;
`

const ResizableContent = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

const Bar = styled.div<{ show?: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  background-color: ${({ theme }) => theme.core.textColor};
  box-shadow: 0 -0.125rem 0 0 ${({ theme }) => theme.core.textColor},
    0 0.125rem 0 0 ${({ theme }) => theme.core.textColor};
  cursor: row-resize;
  opacity: 0.1;
  z-index: 1;
  height: 0.25rem;
  width: 100%;

  &:hover {
    box-shadow: 0 -0.125rem 0 0 ${({ theme }) => theme.core.textColor},
      0 0.125rem 0 0 ${({ theme }) => theme.core.textColor};
    opacity: 0.3;
    transition: all 200ms ease-in-out;
  }

  user-select: none;
`

interface Props {
  children: [React.ReactNode, React.ReactNode]
  defaultHeight: number
}

const Resizer: React.FC<Props> = ({ defaultHeight, children }) => {
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
            <Bar
              onMouseDown={startDragging.current!}
              onTouchStart={startDragging.current!}
              show
            />
            {children[1]}
          </ResizableContent>
        </ResizableSection>
      )}
    </ResizerStyle>
  )
}

export default Resizer
