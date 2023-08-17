interface Navigator {
  standalone?: boolean
}

export const isPWA = () =>
  (window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator).standalone) ??
  false
