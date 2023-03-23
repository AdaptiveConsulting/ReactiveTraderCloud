import { Meta } from "@storybook/react"

import Resizer from "./Resizer"

export default {
  title: "Components/Resizer",
  component: Resizer,
} as Meta<typeof Resizer>

export const Default = {
  render: () => (
    <Resizer defaultHeight={50}>
      <div>Child 1</div>
      <div>Child 2</div>
    </Resizer>
  ),

  name: "Resizer",
}
