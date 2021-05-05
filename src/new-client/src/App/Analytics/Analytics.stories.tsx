import React from "react"
import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"
import AnalyticsCore from "@/App/Analytics/AnalyticsCore"
import styled from "styled-components"

const stories = storiesOf("Analytics", module)

const AnalyticsWrapper = styled.div`
  flex: 0 0 371px;
  padding: 0.5rem 1rem 0.5rem 0;
  user-select: none;
  overflow: hidden;
  margin-left: auto;
  margin-right: auto;
`
stories.add("Analytics", () => (
  <Story>
    <AnalyticsWrapper>
      <AnalyticsCore />
    </AnalyticsWrapper>
  </Story>
))
