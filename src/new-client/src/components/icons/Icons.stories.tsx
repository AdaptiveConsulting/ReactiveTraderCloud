import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"
import styled from "styled-components"
import { Flex } from "@/Web/Web.styles"
import { AppleShareIcon, CrossIcon } from "./index"
import { PopInIcon } from "./PopInIcon"
import { PopOutIcon } from "./PopOutIcon"
import { ToggleView } from "@/App/LiveRates/MainHeader/ToggleView/ToggleView"

const stories = storiesOf("Icons", module)

stories.add("AppleShareIcon", () => (
  <Story>
    <Flex> {AppleShareIcon} </Flex>
  </Story>
))

stories.add("CrossIcon", () => (
  <Story>
    <Flex> {CrossIcon} </Flex>
  </Story>
))

stories.add("PopInIcon", () => (
  <Story>
    <Flex>
      <PopInIcon />
    </Flex>
  </Story>
))

stories.add("PopOutIcon", () => (
  <Story>
    <Flex>
      <PopOutIcon />
    </Flex>
  </Story>
))

stories.add("ToggleView", () => (
  <Story>
    <Flex>
      <ToggleView />
    </Flex>
  </Story>
))
