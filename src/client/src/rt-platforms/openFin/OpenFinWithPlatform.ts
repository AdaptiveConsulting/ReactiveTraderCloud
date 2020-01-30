interface ExtendedFin {
  Platform: any
}

export const finWithPlatform: ExtendedFin & typeof fin = window.fin as any
