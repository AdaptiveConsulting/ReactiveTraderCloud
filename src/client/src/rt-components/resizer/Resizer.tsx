import React, { Component } from 'react'
import styled from 'styled-components/macro'

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

interface State {
  dragging: boolean
  height: number
}

export default class Resizer extends Component<Props, State> {
  wrapperRef = React.createRef<HTMLDivElement>()

  state = {
    dragging: false,
    height: this.props.defaultHeight,
  }

  componentDidMount = () => {
    // Add event listeners to mouse and touch movements on component mount

    document.addEventListener('mousemove', this.handleMouseMove)

    document.addEventListener('mouseup', this.handleStop)

    document.addEventListener('touchmove', this.handleTouchMove)

    document.addEventListener('touchend', this.handleStop)
  }

  componentWillUnmount = () => {
    // Remove event listeners on unmount

    document.removeEventListener('mousemove', this.handleMouseMove)

    document.removeEventListener('mouseup', this.handleStop)

    document.removeEventListener('touchmove', this.handleTouchMove)

    document.removeEventListener('touchend', this.handleStop)
  }

  handleStop = () => {
    if (this.state.dragging) {
      this.setState({ dragging: false })
    }
  }

  handleStart = () => this.setState({ dragging: true })

  handleMouseMove = (event: MouseEvent) => this.setHeight(event.clientY)

  handleTouchMove = (event: TouchEvent) => this.setHeight(event.touches[0].clientY)

  setHeight = (clientY: number) => {
    // If we're not dragging the resize bar, don't do anything
    if (!this.state.dragging) {
      return
    }

    const wrapperElement = this.wrapperRef.current

    if (!wrapperElement) {
      return
    }

    // Calculate the height of the bottom div based on cursor position
    const wrapperHeight = wrapperElement.offsetHeight
    const wrapperTop = wrapperElement.offsetTop
    const wrapperOffset = clientY - wrapperTop
    const rawHeight = wrapperHeight - wrapperOffset

    // Calculate height as a percentage of parent
    let height = Math.round((rawHeight / wrapperHeight) * 100)

    // Block heights that would completely overlap top div
    if (height > 90) {
      height = 90
    }

    // Block heights that would hide bottom div
    if (height < 10) {
      height = 10
    }

    this.setState({ height })
  }

  render() {
    const { children, component, disabled } = this.props
    let { height } = this.state

    if (disabled) {
      height = 0
    }

    return (
      <ResizerStyle ref={this.wrapperRef}>
        <ResizableSection height={100 - height}>
          <ResizableContent>{children}</ResizableContent>
        </ResizableSection>
        <ResizableSection height={height}>
          <ResizableContent>
            <Bar onMouseDown={this.handleStart} onTouchStart={this.handleStart} />
            {component()}
          </ResizableContent>
        </ResizableSection>
      </ResizerStyle>
    )
  }
}
