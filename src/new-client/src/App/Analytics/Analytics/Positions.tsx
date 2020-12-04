import React from "react"
import { BubbleChart, Title } from "./styled"
// import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

export const Positions: React.FC = () => {
  return (
    <div>
      <Title>Positions</Title>
      <BubbleChart>{/*<PositionsBubbleChart />*/}</BubbleChart>
    </div>
  )
}
