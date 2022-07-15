import { memo, useEffect, useLayoutEffect, useRef, useState } from "react"
import styled, { css, keyframes } from "styled-components"

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 16px;
  padding: 0 16px;
`

export const TimeLeft = styled.div<{ margin: "left" | "right" }>`
  font-size: 10px;
  opacity: 0.6;
  white-space: nowrap;
  ${({ margin }) =>
    margin === "left" ? "margin-left: 0.5rem" : "margin-right: 0.5rem"};
`

export const ProgressBarWrapper = styled.div<{ isSellSideView: boolean }>`
  background-color: ${({ theme, isSellSideView }) =>
    isSellSideView ? theme.colors.light.primary[1] : theme.core.darkBackground};
  height: 6px;
  width: 100%;
  border-radius: 3px;
`

const changeWidth = (start: number, end: number) => keyframes`
  from { width: ${start}% }
  to { width: ${end}%}
`

const progressAnimation = ({
  start,
  end,
  transitionTime,
}: {
  start: number
  end: number
  transitionTime: number
}) =>
  css`
    ${changeWidth(start, end)} ${transitionTime}ms linear;
  `

export const ProgressBar = memo(styled.div<{
  start: number
  end: number
  transitionTime: number
}>`
  background-color: ${({ theme }) => theme.accents.primary.base};
  border-radius: 3px;
  height: 100%;
  animation: ${progressAnimation};
`)

const SecsTimer: React.FC<{ end: number }> = ({ end }) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.round((end - Date.now()) / 1000),
  )
  const expired = timeLeft <= 0
  useLayoutEffect(() => {
    if (!expired) {
      const id = setInterval(() => {
        setTimeLeft((x) => x - 1)
      }, 1000)
      return () => clearInterval(id)
    }
  }, [expired])

  const timeLeftMins = Math.trunc(timeLeft / 60)
  const timeLeftSecs = timeLeft % 60

  return (
    <>
      {timeLeftMins}M {timeLeftSecs}S
    </>
  )
}

const TimeProgress: React.FC<{
  start: number
  end: number
}> = ({ start, end }) => {
  const transitionTime = useRef(end - Date.now())
  const startWidthPercentage = useRef(
    ((end - Date.now()) / (end - start)) * 100,
  )

  return (
    <ProgressBar
      transitionTime={transitionTime.current}
      start={startWidthPercentage.current}
      end={0}
    />
  )
}

export const CreditTimer: React.FC<{
  start: number
  end: number
  isSellSideView: boolean
}> = ({ start, end, isSellSideView }) => {
  const [timerEnded, setTimerEnded] = useState(Date.now() >= end)

  useEffect(() => {
    if (!timerEnded) {
      const id = setInterval(() => {
        if (Date.now() >= end) {
          setTimerEnded(true)
        }
      }, 1000)
      return () => clearInterval(id)
    }
  }, [timerEnded, end])

  return timerEnded ? null : (
    <>
      {!isSellSideView && (
        <TimeLeft margin={"right"}>
          <SecsTimer end={end} />
        </TimeLeft>
      )}
      <ProgressBarWrapper isSellSideView={isSellSideView}>
        <TimeProgress start={start} end={end} />
      </ProgressBarWrapper>
      {isSellSideView && (
        <TimeLeft margin={"left"}>
          <SecsTimer end={end} />
        </TimeLeft>
      )}
    </>
  )
}
