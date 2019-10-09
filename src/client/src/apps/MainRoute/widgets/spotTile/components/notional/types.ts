export type ValidationMessage = null | {
  type: 'warning' | 'error' | 'info'
  content: string
}
