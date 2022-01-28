import styled, { DefaultTheme, keyframes } from "styled-components"
import { NlpExecutionState, NlpExecutionStatus } from "./state"

const getBarColor = (state: NlpExecutionState, theme: DefaultTheme) => {
  if (state.type !== NlpExecutionStatus.Done) {
    return theme.colors.accents.primary.base
  }

  return state.payload.response.type === "ok"
    ? theme.colors.accents.positive.base
    : theme.colors.accents.negative.base
}

const Slider = styled.div`
  position: absolute;
  width: 100%;
  height: 3px;
  overflow: hidden;
  top: 0;
  left: 0;
`
const Line = styled.div<{ state: NlpExecutionState }>`
  position: absolute;
  opacity: ${({ state }) =>
    state.type === NlpExecutionStatus.Done ? "1.0" : "0.4"};
  background: ${({ theme, state }) => getBarColor(state, theme)};
  width: 150%;
  height: 3px;
`
const SubLine = styled.div<{ state: NlpExecutionState }>`
  position: absolute;
  background: ${({ theme, state }) => getBarColor(state, theme)};
  height: 3px;
`

const Increase = keyframes`
  from { left: -5%; width: 5%; }
  to { left: 130%; width: 100%;}
`
const Decrease = keyframes`
  from { left: -80%; width: 80%; }
  to { left: 110%; width: 10%;}
`

const Inc = styled(SubLine)`
  animation: ${Increase} 2s infinite;
`
const Dec = styled(SubLine)`
  animation: ${Decrease} 2s 0.5s infinite;
`

export function IndeterminateLoadingBar({
  state,
}: {
  state: NlpExecutionState
}) {
  if (state.type < NlpExecutionStatus.WaitingToExecute) return null

  return (
    <Slider>
      <Line state={state} />
      {state.type !== NlpExecutionStatus.Done && (
        <>
          <Inc state={state} />
          <Dec state={state} />
        </>
      )}
    </Slider>
  )
}
