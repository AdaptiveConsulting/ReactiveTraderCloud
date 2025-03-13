import styled, { DefaultTheme, keyframes } from "styled-components"

const getBarColor = (
  successful: boolean,
  done: boolean,
  theme: DefaultTheme,
) => {
  if (!done) {
    return theme.color["Colors/Background/bg-brand-primary"]
  }

  return successful
    ? theme.color["Colors/Background/bg-success-primary"] // TODO: get a proper positive colour from UX
    : theme.color["Colors/Background/bg-error-primary"] // TODO: get a proper negative colour from UX
}

const Slider = styled.div`
  position: absolute;
  width: 100%;
  height: 3px;
  overflow: hidden;
  top: 0;
  left: 0;
`
const Line = styled.div<{ successful: boolean; done: boolean }>`
  position: absolute;
  opacity: ${({ done }) => (done ? "1.0" : "0.4")};
  background: ${({ theme, successful, done }) =>
    getBarColor(successful, done, theme)};
  width: 150%;
  height: 3px;
`
const SubLine = styled.div<{ successful: boolean; done: boolean }>`
  position: absolute;
  background: ${({ theme, successful, done }) =>
    getBarColor(successful, done, theme)};
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
  done,
  successful,
  waitingToExecute,
}: {
  waitingToExecute: boolean
  done: boolean
  successful: boolean
}) {
  if (waitingToExecute) return null

  return (
    <Slider>
      <Line done={done} successful={successful} />
      {!done && (
        <>
          <Inc done={done} successful={successful} />
          <Dec done={done} successful={successful} />
        </>
      )}
    </Slider>
  )
}
