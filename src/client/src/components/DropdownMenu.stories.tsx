import { ComponentMeta, ComponentStory } from "@storybook/react"
import { DropdownMenu } from "./DropdownMenu"

export default {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  args: {
    options: ["George", "Paul", "Ringo", "John"],
    onSelectionChange: console.log,
  },
} as ComponentMeta<typeof DropdownMenu>

const Template: ComponentStory<typeof DropdownMenu> = (args) => (
  <DropdownMenu {...args} />
)

export const WithoutSelectionSpecified = Template.bind({})
WithoutSelectionSpecified.args = {}

export const WithSelectionSpecified = Template.bind({})
WithSelectionSpecified.args = { selection: "Ringo" }
