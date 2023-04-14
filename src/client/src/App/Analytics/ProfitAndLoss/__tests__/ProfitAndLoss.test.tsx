//  import { Subscribe } from "@react-rxjs/core"
import { BehaviorSubject } from "rxjs"

import { HistoryEntry } from "@/services/analytics"
import { analyticsMock } from "@/services/analytics/__mocks__/_analytics"
// import { TestThemeProvider } from "@/utils/testUtils"

// import { LineChart, lineChart$ } from "../LineChart"

vi.mock("@/services/analytics/analytics")

const historyMock1: HistoryEntry[] = [
  {
    timestamp: 1613402446096,
    usPnl: -2722245.789415593,
  },
  {
    timestamp: 1613402456097,
    usPnl: -2713309.3362381877,
  },
  {
    timestamp: 1613402466096,
    usPnl: -2700750.747100412,
  },
]

const historyMock2: HistoryEntry[] = [
  {
    timestamp: 1613402446096,
    usPnl: -2722245.789415593,
  },
  {
    timestamp: 1613402456097,
    usPnl: -2713309.3362381877,
  },
  {
    timestamp: 1613402466096,
    usPnl: -2700750.747100412,
  },
  {
    timestamp: 1613402466098,
    usPnl: -2700750.74710042,
  },
]

describe("Profit and Loss", () => {
  beforeEach(() => {
    analyticsMock.__resetMocks()
  })

  it.skip("renders the chart correctly", () => {
    const historyMock$ = new BehaviorSubject<HistoryEntry[]>(historyMock1)
    analyticsMock.__setHistoryMock(historyMock$)

    // const tree = renderer
    //   .create(
    //     <TestThemeProvider>
    //       <Subscribe source$={lineChart$} fallback="No data">
    //         <LineChart />
    //       </Subscribe>
    //     </TestThemeProvider>,
    //   )
    //   .toJSON()

    // expect(tree).toMatchSnapshot()
  })

  it.skip("renders the chart with updates", () => {
    const historyMock$ = new BehaviorSubject<HistoryEntry[]>(historyMock2)
    analyticsMock.__setHistoryMock(historyMock$)

    // const tree = renderer
    //   .create(
    //     <TestThemeProvider>
    //       <Subscribe source$={lineChart$} fallback="No data">
    //         <LineChart />
    //       </Subscribe>
    //     </TestThemeProvider>,
    //   )
    //   .toJSON()

    // expect(tree).toMatchSnapshot()
  })
})
