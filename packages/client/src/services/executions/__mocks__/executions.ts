import { Mock } from "vitest"

let mock = vi.fn()

export const __setExecute$ = (input: Mock<any>) => {
  mock = input
}

export const execute$ = (...args: any[]) => {
  return mock(...args)
}

export const __resetMocks = () => {
  mock = vi.fn()
}
