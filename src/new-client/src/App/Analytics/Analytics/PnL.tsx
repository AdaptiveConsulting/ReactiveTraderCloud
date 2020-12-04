import React from "react"
import { useCurrentPositions, currentPositions$ } from "services/analytics"
import { AnalyticsBarChart } from "./analyticsBarChart"
import { Title } from "./styled"

export const PnL: React.FC = () => {
  const chartData = useCurrentPositions()
  return (
    <div>
      <Title>PnL</Title>
      <AnalyticsBarChart chartData={chartData} />
    </div>
  )
}

export const pnL$ = currentPositions$
