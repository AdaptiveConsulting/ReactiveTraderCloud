import { storiesOf } from "@storybook/react"
import styled from "styled-components"
import Story from "@/stories/Story"
import { Flex } from "@/Web/Web.styles"
import { TOTAL_WIDTH, TOTAL_HEIGHT } from "./ProfitAndLoss/LineChart/constants"
import { ReferenceLine } from "./ProfitAndLoss/LineChart/ReferenceLine"
const stories = storiesOf("Analytics", module)

stories.add("Analytics test", () => (
  <Story>
    <Flex>
      <svg viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}>d</svg>
    </Flex>
  </Story>
))
