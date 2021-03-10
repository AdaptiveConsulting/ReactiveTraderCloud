import { Subscribe } from "@react-rxjs/core"
import { render, screen, act } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"
import { TestThemeProvider } from "@/utils/testUtils"
import { LastPosition, lastPosition$ } from "./LastPosition"
import { HistoryEntry } from "@/services/analytics"

jest.mock("@/services/analytics/analytics")

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

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <Subscribe source$={lastPosition$} fallback="No data">
        <LastPosition />
      </Subscribe>
    </TestThemeProvider>,
  )

const _analytics = require("@/services/analytics/analytics")

describe("LastPositions", () => {
  beforeEach(() => {
    _analytics.__resetMocks()
  })

  it("should render the initial last position value", () => {
    const historyMock$ = new BehaviorSubject<HistoryEntry[]>(historyMock1)
    _analytics.__setHistoryMock(historyMock$)

    renderComponent()

    expect(screen.getAllByRole("lastPosition")[0].textContent).toBe(
      `-2,713,309`,
    )
  })

  it("should display the updated last position", () => {
    const historyMock$ = new BehaviorSubject<HistoryEntry[]>(historyMock1)
    _analytics.__setHistoryMock(historyMock$)

    renderComponent()

    expect(screen.getAllByRole("lastPosition")[0].textContent).toBe(
      `-2,713,309`,
    )

    act(() => historyMock$.next(historyMock2))

    expect(screen.getAllByRole("lastPosition")[0].textContent).toBe(
      `-2,700,751`,
    )
  })

  it("should display positive and negative number correctly", () => {
    const historyMock$ = new BehaviorSubject<HistoryEntry[]>(historyMock1)
    _analytics.__setHistoryMock(historyMock$)

    renderComponent()

    expect(screen.getAllByRole("lastPosition")[0].textContent).toBe(
      `-2,713,309`,
    )

    act(() => historyMock$.next(historyMock3))

    expect(screen.getAllByRole("lastPosition")[0].textContent).toBe(
      `+2,700,751`,
    )
  })
})
