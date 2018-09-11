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
    document.addEventListener('mousemove', this.handleMouseMove)

    document.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousemove', this.handleMouseMove)

    document.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => this.setState({ dragging: false })

  handleMouseDown = () => this.setState({ dragging: true })

  handleMouseMove = (event: MouseEvent) => {
    if (!this.state.dragging) {
      return
    }

    const wrapperElement = this.wrapperRef.current

    if (!wrapperElement) {
      return
    }

    const wrapperHeight = wrapperElement.offsetHeight
    const wrapperTop = wrapperElement.offsetTop
    const wrapperOffset = event.clientY - wrapperTop
    const diff = wrapperHeight - wrapperOffset

    let height = Math.round((diff / wrapperHeight) * 100)

    if (height > 90) {
      height = 90
    }

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
          <Bar onMouseDown={this.handleMouseDown} />
          {component()}
        </Resizable>
      </Wrapper>
    )
  }
}
