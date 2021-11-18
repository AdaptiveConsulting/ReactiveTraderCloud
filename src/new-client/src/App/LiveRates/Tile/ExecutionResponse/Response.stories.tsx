import Pending from "./Pending"
import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"

const stories = storiesOf("Trade Notification", module)

stories.add("Pending", () => (
  <Story>
    <Pending />
  </Story>
))
