export interface MultiTimeoutStage {
  duration: number
  onEnter?: (stage: number) => void
  onLeave?: (stage: number) => void
}
