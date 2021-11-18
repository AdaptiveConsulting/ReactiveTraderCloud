import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"
import { Modal } from "./Modal"

const stories = storiesOf("Modal", module)

stories.add("Modal", () => (
  <Story>
    <Modal shouldShow={true} title={"Modal Title"}>
      <h2>Modal Content</h2>This is some modal content
    </Modal>
  </Story>
))
