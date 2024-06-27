import { Subscribe } from "@react-rxjs/core"
import { act, render, screen } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"

import { TestThemeProvider } from "@/client/utils/testUtils"
import { HistoryEntry } from "@/services/analytics"
import { analyticsMock } from "@/services/analytics/__mocks__/_analytics"

import { LastPosition, lastPosition$ } from "../LastPosition"

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
]

const historyMock3: HistoryEntry[] = [
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
    timestamp: 1613402466096,
    usPnl: 2700750.747100412,
  },
]

const renderComponent = async () =>
  await act(async () =>
    render(
      <TestThemeProvider>
        <Subscribe source$={lastPosition$} fallback="No data">
          <LastPosition />
        </Subscribe>
      </TestThemeProvider>,
    ),
  )

describe("LastPositions", () => {
  beforeEach(() => {
    analyticsMock.__resetMocks()
  })

  it("should render the initial last position value", async () => {
    const historyMock$ = new BehaviorSubject<HistoryEntry[]>(historyMock1)
    analyticsMock.__setHistoryMock(historyMock$)

    await renderComponent()

    expect(screen.getAllByTestId("lastPosition")[0].textContent).toBe(
      `-2,713,309`,
    )
  })

  it("should display the updated last position", async () => {
    const historyMock$ = new BehaviorSubject<HistoryEntry[]>(historyMock1)
    analyticsMock.__setHistoryMock(historyMock$)

    await renderComponent()

    expect(screen.getAllByTestId("lastPosition")[0].textContent).toBe(
      `-2,713,309`,
    )

    act(() => historyMock$.next(historyMock2))

    expect(screen.getAllByTestId("lastPosition")[0].textContent).toBe(
      `-2,700,751`,
    )
  })

  it("should display positive and negative number correctly", async () => {
    const historyMock$ = new BehaviorSubject<HistoryEntry[]>(historyMock1)
    analyticsMock.__setHistoryMock(historyMock$)

    await renderComponent()

    expect(screen.getAllByTestId("lastPosition")[0].textContent).toBe(
      `-2,713,309`,
    )

    act(() => historyMock$.next(historyMock3))

    expect(screen.getAllByTestId("lastPosition")[0].textContent).toBe(
      `+2,700,751`,
    )
  })
})
