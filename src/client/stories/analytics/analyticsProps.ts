import { pnlChartModelData } from './pnlChartModel'
import { positionsChartModelData } from './positionsChartModel'

const analyticsProps = {
  isConnected: true,
  pnlChartModel: pnlChartModelData,
  positionsChartModel: positionsChartModelData
}

// convert stringified dates to date format
analyticsProps.pnlChartModel.seriesData.forEach((el: { x }) => el.x = new Date(el.x))

export const { pnlChartModel, positionsChartModel } = analyticsProps

export default analyticsProps
