import { Meta } from "@storybook/react"

import { Loader as LoaderComponent } from "./Loader"

export default {
  title: "Components/Loading/Loader",
  component: LoaderComponent,
} as Meta<typeof LoaderComponent>

export const Loader = {
  args: {
    size: 40,
  },
}
