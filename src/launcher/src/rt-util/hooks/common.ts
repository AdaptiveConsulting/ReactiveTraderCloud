export interface MultiTimeoutStage {
  duration: number
  onEnter?: (stage: number) => void
  onLeave?: (stage: number) => void
}

export const isParentOf = (parent: HTMLElement, child: HTMLElement | null): boolean => {
  if (child === null) {
    return false
  }
  if (child === parent) {
    return true
  }
  return isParentOf(parent, child.parentElement)
}
