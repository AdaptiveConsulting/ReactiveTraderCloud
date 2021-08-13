import { Component, ErrorInfo } from "react"
import { ThemeProvider } from "@/theme"

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

jest.mock("@/theme/globals", () => {})

export const TestThemeProvider: React.FC = ({ children }) => (
  <ThemeProvider storage={mockedLocalStorage}>{children}</ThemeProvider>
)

export class TestErrorBoundary extends Component<
  {
    onError: (error: Error, errorInfo: ErrorInfo) => void
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
