const initialState = {
  isRunningOnDesktop: typeof fin !== 'undefined'
}
type EnvironmentState = typeof initialState

export const enviromentReducer = (state: EnvironmentState = initialState) => state
