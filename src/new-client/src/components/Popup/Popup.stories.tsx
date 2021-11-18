import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"
import Popup from "./Popup"

const stories = storiesOf("Popup", module)

stories.add("Popup", () => (
  <Story>
    <Popup open={true}>
      <h2>Popup Content</h2>This is some popup content
    </Popup>
  </Story>
))
