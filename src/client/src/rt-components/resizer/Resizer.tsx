import React, { Component } from 'react'
import { styled } from 'rt-theme'

const Wrapper = styled.div<{ height: number }>`
  height: ${({ height }) => height + 'px'};
  max-height: 100%;
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
    transition: all 2s ease;
  }
`

interface State {
  dragging: boolean
  height: number
}

export default class Resizer extends Component<{}, State> {
  wrapperRef = React.createRef<HTMLDivElement>()

  state = {
    dragging: false,
    height: 250
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

    const element = this.wrapperRef.current

    if (!element) {
      return
    }

    const height = element.parentElement.offsetHeight
    const top = element.parentElement.offsetTop
    const offset = event.clientY - top
    this.setState({ height: height - offset })
  }

  render() {
    const { children } = this.props

    return (
      <Wrapper innerRef={this.wrapperRef} onMouseDown={this.handleMouseDown} height={this.state.height}>
        <Bar />
        {children}
      </Wrapper>
    )
  }
}
