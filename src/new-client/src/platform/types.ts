export type PlatformType = "web" | "openfin" | "finsemble"

// TODO - Revisit when we implement OpenFin and Finsemble platforms
// This was the minimum needed to be able to differentiate platform in child components
export type Platform = {
  type: PlatformType
}
