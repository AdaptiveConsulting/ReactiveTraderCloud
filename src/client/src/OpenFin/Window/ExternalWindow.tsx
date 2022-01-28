import { useEffect } from "react"

interface WindowConfig {
  name: string
  url: string
  width: number
  height: number
  displayName?: string
  minHeight?: number
  minWidth?: number
  maxHeight?: number
  maxWidth?: number
  center?: "parent" | "screen"
  x?: number
  y?: number
  saveWindowState?: boolean
}

const defaultWindowConfig: WindowConfig = {
  name: "",
  url: "",
  width: 600,
  height: 640,
  center: "parent",
  x: 0,
  y: 0,
}

interface Props {
  config?: WindowConfig
  onUnload?: () => void
}

const ExternalWindow: React.FC<Props> = ({
  config = defaultWindowConfig,
  onUnload,
}) => {
  useEffect(() => {
    let window: fin.OpenFinWindow | null = null

    async function getWindow() {
      const platform = await fin.Platform.getCurrent()
      const window = await platform.createWindow({})
    }
  }, [])

  return null
}
