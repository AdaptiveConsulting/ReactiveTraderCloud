import main from "./main"

declare global {
  const __TARGET__: "web" | "openfin" | "finsemble"

  interface Window {
    ga: any
  }
}

main()
