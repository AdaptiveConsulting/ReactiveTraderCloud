import main from "./main"

declare global {
  interface Window {
    ga: any
  }
}

main()

// Google Cloud Run kills all ws connections after 1 hour
// Reload the application to establish a new connection and avoid staring at the DisconnectionOverlay indefinitely
// This is a temporary measure while we have the GCR limitation
const reloadAfter1Hour = () => {
  setTimeout(() => {
    window.location.reload()
  }, 60 * 60 * 1000)
}

reloadAfter1Hour()
