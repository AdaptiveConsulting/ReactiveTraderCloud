import { Component, ErrorInfo, ReactNode } from "react"

import { ThemeProvider } from "@/client/theme"

class LocalStorageMock {
  store: Record<string, string>
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key: string) {
    return this.store[key] || null
  }

  setItem(key: string, value: string) {
    this.store[key] = value
  }

  removeItem(key: string) {
    delete this.store[key]
  }

  get length(): number {
    return Object.keys(this.store).length
  }
  key() {
    return null
  }
}

const mockedLocalStorage = new LocalStorageMock()

vi.mock("@/client/theme/globals", () => ({}))

export const TestThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider storage={mockedLocalStorage}>{children}</ThemeProvider>
)

export class TestErrorBoundary extends Component<
  {
    onError: (error: Error, errorInfo: ErrorInfo) => void
    children: ReactNode
  },
  {
    hasError: boolean
  }
> {
  state = {
    hasError: false,
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(error, errorInfo)
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return "error"
    }

    return this.props.children
  }
}

export const setupMockWindow = () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetHeight",
  )
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth",
  )

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 50,
    })
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 50,
    })
  })

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetHeight",
      originalOffsetHeight as PropertyDescriptor,
    )
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetWidth",
      originalOffsetWidth as PropertyDescriptor,
    )
  })
}
