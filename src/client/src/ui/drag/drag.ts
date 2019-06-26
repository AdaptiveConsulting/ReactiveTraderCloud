import { Environment } from 'rt-system'

/* Drag handler

onDragStart 
  we create a clone of the dragged node, set some styles and add it to the DOM
  we add a ondragover listener and record the dragged coordinates
  we replace the default drag image with a div that is not displayed

onDrag we move the added div to the recorded coordinates 

onDragEnd 
  we remove the cloned node from the DOM 
  we call the popout callback
  we clean up variables and listeners
*/

export const tilesAreDraggabe = !Environment.isRunningInIE()

export const withDrag = () => {
  let dragNode: HTMLElement | undefined
  let dragX = 0
  let dragY = 0

  const createDragImage = function($node: HTMLElement) {
    const clonedNode = $node.cloneNode(true) as HTMLElement
    clonedNode.style.position = 'absolute'

    clonedNode.style.width = `${$node.offsetWidth}px`
    clonedNode.style.height = `${$node.offsetHeight}px`
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
      setTimeout(() => {
        dragNode = createDragImage(element)
      })
      const div = document.createElement('div')
      div.style.display = 'none'
      dt.setDragImage(div, 0, 0)
    }
  }

  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation()
    requestAnimationFrame(() => {
      if (dragNode) {
        dragNode.style.left = `${Math.max(0, dragX)}px`
        dragNode.style.top = `${Math.max(0, dragY)}px`
      }
    })
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
    document.removeEventListener('dragover', null)
  }
  return {
    onDragStart,
    onDrag,
    onDragEnd,
  }
}
