import { Meta } from "@storybook/react"

import Logo from "./logos/AdaptiveLogo"

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
} as Meta<typeof Logo>

export const WithText = {
  args: {},
}

export const WithoutText = {
  args: {
    withText: false,
  },
}
