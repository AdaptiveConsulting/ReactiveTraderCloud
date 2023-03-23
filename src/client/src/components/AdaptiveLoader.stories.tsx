import { Meta } from "@storybook/react"

import { AdaptiveLoader } from "./AdaptiveLoader"

export default {
  title: "Components/Loading/AdaptiveLoader",
  component: AdaptiveLoader,
  args: {
    size: 40,
  },
} as Meta<typeof AdaptiveLoader>

export const Primary = {
  args: {
    type: "primary",
  },
}

export const Secondary = {
  args: {
    type: "secondary",
  },
}
