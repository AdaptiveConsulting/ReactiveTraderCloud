import { memo, useEffect, useLayoutEffect, useRef, useState } from "react"
import styled, { css, keyframes } from "styled-components"

import { Typography } from "@/client/components/Typography"

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 16px;
  padding: 0 16px;
`

export const TimeLeft = styled.div`
  color: ${({ theme }) => theme.textColor};
  font-size: 10px;
  opacity: 0.6;
  white-space: nowrap;
`

export const ProgressBarWrapper = styled.div`
  margin: 0 ${({ theme }) => theme.newTheme.spacing.sm};
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
}) => css`
  ${changeWidth(start, end)} ${transitionTime}ms linear;
`

export const ProgressBar = memo(styled.div<{
  start: number
  end: number
  transitionTime: number
}>`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Foreground/fg-brand-primary (600)"]};
  border-radius: 3px;
  height: 100%;
  animation: ${progressAnimation};
`)

const TimeProgress = ({ start, end }: { start: number; end: number }) => {
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

export const SecsTimer = ({ end }: { end: number }) => {
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
    <Typography
      variant="Text sm/Regular"
      color="Colors/Text/text-primary (900)"
    >
      {timeLeftMins}m {timeLeftSecs}s
    </Typography>
  )
}

export const CreditRfqTimer = ({
  start,
  end,
  isSellSideView,
}: {
  start: number
  end: number
  isSellSideView: boolean
}) => {
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
        <TimeLeft>
          <SecsTimer end={end} />
        </TimeLeft>
      )}
      <ProgressBarWrapper>
        <TimeProgress start={start} end={end} />
      </ProgressBarWrapper>
      {isSellSideView && (
        <TimeLeft>
          <SecsTimer end={end} />
        </TimeLeft>
      )}
    </>
  )
}
