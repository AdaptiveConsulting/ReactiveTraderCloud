import { Meta } from "@storybook/react"

import { DropdownMenu } from "./DropdownMenu"

export default {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  args: {
    options: ["John", "Paul", "George", "Ringo"],
    onSelectionChange: console.log,
  },
} as Meta<typeof DropdownMenu>

export const WithoutSelectionSpecified = {
  args: {},
}

export const WithSelectionSpecified = {
  args: { selectedOption: "Paul" },
}
