import { Meta } from "@storybook/react"

import Logo from "./Logo"

export default {
  title: "Components/Logo",
  component: Logo,
  args: {
    fill: "#000",
    size: 2,
    withText: true,
  },
  argTypes: {
    fill: {
      control: "color",
    },
  },
} as unknown as Meta<typeof Logo>

export const WithText = {
  args: {},
}

export const WithoutText = {
  args: {
    withText: false,
  },
}
