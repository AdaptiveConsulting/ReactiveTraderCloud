interface EnvironmentState {
  isRunningOnDesktop: boolean
}

const initialState: EnvironmentState = {
  isRunningOnDesktop: typeof fin !== 'undefined'
}

export const enviromentReducer = (state: EnvironmentState = initialState): EnvironmentState => state
