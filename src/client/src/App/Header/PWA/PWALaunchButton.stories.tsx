import { Meta } from "@storybook/react"

import { LaunchButtonInner } from "./PWALaunchButton"

export default {
  title: "Header/PWALaunchButton",
  component: LaunchButtonInner,
} as Meta<typeof LaunchButtonInner>

export const HasPrompt = {
  args: {
    hasPrompt: true,
  },
}

export const NoPrompt = {
  args: {
    hasPrompt: false,
  },
}
