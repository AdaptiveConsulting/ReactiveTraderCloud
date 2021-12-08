import { mockTrades } from "@/services/trades/__mocks__/mockTrades"
import { Subscribe } from "@react-rxjs/core"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import styled from "styled-components"
import { TradesGridInner } from "./TradesGrid"

export default {
  title: "Trades/TradesGrid",
  component: TradesGridInner,
} as ComponentMeta<typeof TradesGridInner>

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

const Template: ComponentStory<typeof TradesGridInner> = (args) => (
  <TradesStyle>
    <Subscribe>
      <TradesGridInner {...args} />
    </Subscribe>
  </TradesStyle>
)

export const NoTrades = Template.bind({})
NoTrades.args = {
  trades: [],
}

export const WithTrades = Template.bind({})
WithTrades.args = {
  trades: mockTrades,
}
