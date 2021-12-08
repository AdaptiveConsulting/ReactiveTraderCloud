import { ComponentMeta } from "@storybook/react"
import Resizer from "./Resizer"

export default {
  title: "Components/Resizer",
  component: Resizer,
} as ComponentMeta<typeof Resizer>

export const Default = () => (
  <Resizer defaultHeight={50}>
    <div>Child 1</div>
    <div>Child 2</div>
  </Resizer>
)

Default.storyName = "Resizer"
