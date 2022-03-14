import { ComponentStory, ComponentMeta } from "@storybook/react"
import { Loader as LoaderComponent } from "./Loader"

export default {
  title: "Components/Loading/Loader",
  component: LoaderComponent,
} as ComponentMeta<typeof LoaderComponent>

const Template: ComponentStory<typeof LoaderComponent> = (args) => <LoaderComponent {...args} />

export const Loader = Template.bind({})
Loader.args = {
  opacity: 0.8,
  size: 40,
}
