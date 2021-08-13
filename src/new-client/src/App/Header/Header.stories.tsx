import { storiesOf } from "@storybook/react"
import React from "react"
import Header from "./Header"
import Story from "@/stories/Story"

const stories = storiesOf("Header", module)

stories.add("Header", () => (
  <Story>
    <Header />
  </Story>
))
