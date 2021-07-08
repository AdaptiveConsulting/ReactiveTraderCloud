import StatusBar from "@/App/Footer/StatusBar"
import { StatusButton } from "@/App/Footer/StatusButton"
import { Controls } from "./WindowFooter.styles"

export const WindowFooter: React.FC = () => (
  <StatusBar>
    <Controls />
    <StatusButton />
  </StatusBar>
)
