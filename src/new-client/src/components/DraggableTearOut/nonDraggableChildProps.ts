export const nonDraggableChildProps = {
  draggable: true,
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  },
}
