import { Mock } from "vitest"

let mock: Mock<any, any> = vi.fn()

export const __setExecute$ = (input: Mock<any, any>) => {
  mock = input
}

export const execute$ = (...args: any[]) => {
  return mock(...args)
}

export const __resetMocks = () => {
  mock = vi.fn()
}
