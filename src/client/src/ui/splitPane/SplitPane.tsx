import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Pane from './Pane'
import Resizer, { SplitDirection } from './Resizer'
import './split-pane.scss'

interface SplitPaneProps {
  allowResize?: boolean
  className?: string
  primary?: 'first' | 'second'
  children?: JSX.Element[]
  minSize?: number
  maxSize?: number
  defaultSize?: number
  size?: number
  split?: SplitDirection
}

interface SplitPaneState {
  active: boolean
  resized: boolean
  position: number
  draggedSize: number
}

export default class SplitPane extends React.Component<SplitPaneProps, SplitPaneState> {

  static defaultProps = {
    allowResize: true,
    minSize: 40,
    primary: 'first',
    split: 'horizontal'
  }

  private pane1: Pane
  private pane2: Pane
  private splitPaneContainer: Element

  state = {
    active: false,
    resized: false,
    position: null
  } as SplitPaneState

  componentDidMount() {
    this.setSize()
    this.getDocument().addEventListener('mouseup', this.onMouseUp)
    this.getDocument().addEventListener('mousemove', this.onMouseMove)
    this.getDocument().addEventListener('touchmove', this.onTouchMove)
  }

  componentWillReceiveProps(props:SplitPaneProps) {
    this.setSize()
  }

  componentWillUnmount() {
    this.getDocument().removeEventListener('mouseup', this.onMouseUp)
    this.getDocument().removeEventListener('mousemove', this.onMouseMove)
    this.getDocument().removeEventListener('touchmove', this.onTouchMove)
  }

  render() {
    return <div ref={(el:Element) => this.splitPaneContainer = el} className='splitPaneContainer'>
      <Pane ref={(el:Pane) => this.pane1 = el}
            className='pane'
            split={this.props.split}>
        {this.props.children[0]}
      </Pane>
      <Resizer className='resizerContainer'
               onMouseDown={this.onMouseDown}
               split={this.props.split} style={{}}
               resizerClassName='resizer'/>
      <Pane ref={(el:Pane) => this.pane2 = el}
            className='pane'
            split={this.props.split}>
        {this.props.children[1]}
      </Pane>
    </div>
  }

  private unFocus() {
    if (this.getDocument().getSelection()) {
      this.getDocument().getSelection().empty()
    } else {
      try {
        this.getWindow().getSelection().removeAllRanges()
      } catch (e) {}
    }
  }

  private onMouseDown = (event:any):void => {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }]
    })
    this.onTouchStart(eventWithTouches)
  }

  private onMouseMove = (event:any) => {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }]
    })
    this.onTouchMove(eventWithTouches)
  }

  private onMouseUp = (event:any) => {
    const { allowResize } = this.props
    const { active } = this.state
    if (allowResize && active) {
      this.setState({ active: false })
    }
  }

  private onTouchStart = (event:any) => {
    const { allowResize, split } = this.props
    if (allowResize) {
      this.unFocus()
      const position =
        split === 'vertical'
          ? event.touches[0].clientX
          : event.touches[0].clientY

      this.setState({
        active: true,
        position
      })
    }
  }

  private onTouchMove = (event: any) => {
    const { allowResize, maxSize, minSize, split } = this.props
    const { active, position } = this.state
    if (allowResize && active) {
      this.unFocus()
      const isPrimaryFirst = this.props.primary === 'first'
      const ref = isPrimaryFirst ? this.pane1 : this.pane2
      const ref2 = isPrimaryFirst ? this.pane2 : this.pane1
      if (ref) {
        const node = ReactDOM.findDOMNode(ref)
        const node2 = ReactDOM.findDOMNode(ref2)

        if (node.getBoundingClientRect) {
          const width = node.getBoundingClientRect().width
          const height = node.getBoundingClientRect().height
          const current =
            split === 'vertical'
              ? event.touches[0].clientX
              : event.touches[0].clientY
          const size = split === 'vertical' ? width : height
          const positionDelta = position - current
          let sizeDelta = isPrimaryFirst ? positionDelta : -positionDelta

          const pane1Order = parseInt(window.getComputedStyle(node).order, 10)
          const pane2Order = parseInt(window.getComputedStyle(node2).order, 10)
          if (pane1Order > pane2Order) {
            sizeDelta = -sizeDelta
          }

          let newMaxSize = maxSize
          if (maxSize !== undefined && maxSize <= 0) {
            if (split === 'vertical') {
              newMaxSize = this.splitPaneContainer.getBoundingClientRect().width + (+maxSize)
            } else {
              newMaxSize = this.splitPaneContainer.getBoundingClientRect().height + (+maxSize)
            }
          }

          let newSize = size - sizeDelta
          const newPosition = position - positionDelta

          if (newSize < minSize) {
            newSize = minSize
          } else if (maxSize !== undefined && newSize > newMaxSize) {
            newSize = newMaxSize
          } else {
            this.setState({
              position: newPosition,
              resized: true
            })
          }
          this.setState({ draggedSize: newSize })
          ref.setState({ size: newSize })
        }
      }
    }
  }

  private setSize = () => {
    const { primary } = this.props
    const ref = primary === 'first' ? this.pane1 : this.pane2
    let newSize
    if (ref) {
      newSize =
        this.props.size ||
        (this.state && this.state.draggedSize) ||
        this.props.defaultSize ||
        this.props.minSize
      ref.setState({
        size: newSize
      })
      if (this.props.size !== this.state.draggedSize) {
        this.setState({
          draggedSize: newSize
        })
      }
    }
  }

  private getDocument(): HTMLDocument {
    return this.splitPaneContainer.ownerDocument
  }

  private getWindow(): Window {
    return this.getDocument().defaultView
  }
}
