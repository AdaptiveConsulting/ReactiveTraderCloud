let mock: jest.Mock<any, any> = jest.fn()

export const __setExecute$ = (input: jest.Mock<any, any>) => {
  mock = input
}

export const execute$ = (...args: any[]) => {
  return mock(...args)
}

export const __resetMocks = () => {
  mock = jest.fn()
}
