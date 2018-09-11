import React, { Component } from 'react'
import { styled } from 'rt-theme'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const Resizable = styled.div<{ height: number }>`
  height: ${({ height }) => height + '%'};
  overflow-y: hidden;
`

const Bar = styled.div`
  background: #000;
  opacity: 0.2;
  z-index: 1;
  box-sizing: border-box;
  background-clip: padding-box;

  height: 11px;
  margin: -5px 0;
  border-top: 5px solid rgba(255, 255, 255, 0);
  border-bottom: 5px solid rgba(255, 255, 255, 0);
  cursor: row-resize;
  width: 100%;

  &:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
    transition: all 200ms ease;
  }
`

interface Props {
  component: () => React.ReactNode
  minHeight?: number
  defaultHeight: number
}

interface State {
  dragging: boolean
  height: number
}

export default class Resizer extends Component<Props, State> {
  wrapperRef = React.createRef<HTMLDivElement>()

  state = {
    dragging: false,
    height: this.props.defaultHeight
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

  handleStop = () => this.setState({ dragging: false })

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
    const { children, component } = this.props
    const { height } = this.state

    return (
      <Wrapper innerRef={this.wrapperRef}>
        <Resizable height={100 - height}>{children}</Resizable>
        <Resizable height={height}>
          <Bar onMouseDown={this.handleStart} onTouchStart={this.handleStart} />
          {component()}
        </Resizable>
      </Wrapper>
    )
  }
}
