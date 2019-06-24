import { Environment } from 'rt-system'

export const tilesAreDraggabe = !Environment.isRunningInIE()

export const withDrag = () => {
  let dragNode: HTMLElement | undefined
  let dragX = 0
  let dragY = 0

  const createDragImage = function($node: HTMLElement) {
    const clonedNode = $node.cloneNode(true) as HTMLElement
    clonedNode.style.position = 'absolute'

    clonedNode.style.width = $node.offsetWidth + 'px'
    clonedNode.style.height = $node.offsetHeight + 'px'
    clonedNode.classList.add('tearOff')

    document.body.appendChild(clonedNode)
    return clonedNode
  }

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation()
    //required to get FF to fire dragEnd event
    event.dataTransfer.setData('text', 'foo')

    //required for FF as its drag events have no XY coords attached
    document.ondragover = function(dragEvent) {
      dragX = dragEvent.pageX
      dragY = dragEvent.pageY
    }

    const dt = event.dataTransfer
    const element = event.currentTarget
    if (typeof dt.setDragImage === 'function') {
      setTimeout(function() {
        dragNode = createDragImage(element)
      })
      const div = document.createElement('div')
      div.style.display = 'none'
      dt.setDragImage(div, 0, 0)
    }
  }

  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation()
    if (dragNode) {
      dragNode.style.left = Math.max(0, dragX) + 'px'
      dragNode.style.top = Math.max(0, dragY) + 'px'
    }
  }

  const onDragEnd = (
    event: React.DragEvent<HTMLDivElement>,
    popOut: (x: number, y: number) => void,
  ) => {
    event.stopPropagation()
    if (dragNode) {
      document.body.removeChild(dragNode)
      dragNode = undefined
    }
    popOut(event.screenX, event.screenY)
  }
  return {
    onDragStart,
    onDrag,
    onDragEnd,
  }
}
