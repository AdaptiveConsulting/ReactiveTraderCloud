import React, { useState, useCallback, useEffect, useRef } from 'react'
import { styled } from 'rt-theme'

const ResizerStyle = styled.div`
  height: 100%;
`

const ResizableSection = styled.div<{ height: number }>`
  height: ${({ height }) => height + '%'};
  overflow: hidden;
  position: relative;
`

const ResizableContent = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`

const Bar = styled.div`
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
  component: () => React.ReactNode
  minHeight?: number
  defaultHeight: number
  disabled?: boolean
}

const Resizer: React.FC<Props> = ({ component, defaultHeight, children, disabled }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(defaultHeight)
  const [dragging, setDragging] = useState<Boolean>(false)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => setClientHeight(event.clientY)
    const handleStop = () => (dragging ? setDragging(false) : null)
    const handleTouchMove = (event: TouchEvent) => setClientHeight(event.touches[0].clientY)

    // componentDidMount calls
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleStop)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleStop)

    return () => {
      // componentWillUnmount calls - for cleanup
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleStop)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleStop)
    }
  })

  useEffect(() => {
    if (disabled) setHeight(0)

    return () => setHeight(defaultHeight)
  }, [disabled, defaultHeight])

  const handleStart = useCallback(() => setDragging(true), [setDragging])

  const setClientHeight = (clientY: number) => {
    // If we're not dragging the resize bar, don't do anything
    if (!dragging) return

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

  return (
    <ResizerStyle ref={wrapperRef}>
      <ResizableSection height={100 - height}>
        <ResizableContent>{children}</ResizableContent>
      </ResizableSection>
      <ResizableSection height={height}>
        <ResizableContent>
          <Bar onMouseDown={handleStart} onTouchStart={handleStart} />
          {component()}
        </ResizableContent>
      </ResizableSection>
    </ResizerStyle>
  )
}

export default Resizer
