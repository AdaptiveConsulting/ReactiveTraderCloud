import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"
import { AdaptiveLoader } from "./AdaptiveLoader"
import styled from "styled-components"
import { number, withKnobs } from "@storybook/addon-knobs"
import React from "react"

const Flex = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const AdaptiveLoaderStory: React.FC = ({ children }) => (
  <Story>
    <Flex>{children}</Flex>
  </Story>
)

const stories = storiesOf("AdaptiveLoader", module).addDecorator(withKnobs)

stories.add("Interactive", () => {
  const size = number("size", 50)
  const speed = number("speed", 1)
  const separation = number("separation", 3)

  return (
    <AdaptiveLoaderStory>
      <AdaptiveLoader
        size={size}
        type="secondary"
        speed={speed}
        separation={separation}
      />
    </AdaptiveLoaderStory>
  )
})

stories.add("Small", () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={50} type="secondary" />
  </AdaptiveLoaderStory>
))

stories.add("Large", () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={500} type="secondary" />
  </AdaptiveLoaderStory>
))

stories.add("Close", () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={200} type="secondary" separation={0} />
  </AdaptiveLoaderStory>
))

stories.add("Fast", () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={60} type="secondary" speed={0.5} />
  </AdaptiveLoaderStory>
))
