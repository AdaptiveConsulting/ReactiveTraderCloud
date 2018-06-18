interface EnvironmentState {
  isRunningOnDesktop: boolean
}

const INITIAL_STATE: EnvironmentState = {
  isRunningOnDesktop: typeof fin !== 'undefined'
}

export const enviromentReducer = (state: EnvironmentState = INITIAL_STATE): EnvironmentState => state
