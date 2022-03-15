import { OpenFinApp } from "@/OpenFin"
// import { ROUTES_CONFIG } from "./constants"
// import { registerWorkspaceProvider } from "./OpenFin/workspace"

export const gaDimension = "openfin"

export const getMainApp: () => React.FC = () => {
  // Registers a workspace provider, so if openfin workspace is running a new provider section will
  // be shown with all registered apps (currently a list of currency pairs to launch a tile)
  // Commented out until we agree on a use case
  // if (window.location.pathname === ROUTES_CONFIG.tiles) {
  //   registerWorkspaceProvider()
  // }

  return OpenFinApp
}
