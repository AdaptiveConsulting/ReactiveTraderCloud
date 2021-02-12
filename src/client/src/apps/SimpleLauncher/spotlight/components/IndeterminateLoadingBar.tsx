import React from 'react'
import styled, { DefaultTheme, keyframes } from 'styled-components/macro'

export type IndeterminateLoadingBarStatus = 'success' | 'failure' | 'loading' | undefined

const getBarColor = (status: IndeterminateLoadingBarStatus, theme: DefaultTheme) => {
  if (status === 'success') {
    return theme.colors.accents.positive.base
  }
  if (status === 'failure') {
    return theme.colors.accents.negative.base
  }
  return theme.colors.accents.primary.base
}

const Slider = styled.div`
  position: absolute;
  width: 100%;
  height: 3px;
  overflow: hidden;
  top: 0;
  left: 0;
`
const Line = styled.div<{ status: IndeterminateLoadingBarStatus }>`
  position: absolute;
  opacity: ${({ status }) => (status === 'loading' ? '0.4' : '1.0')};
  background: ${({ theme, status }) => getBarColor(status, theme)};
  width: 150%;
  height: 3px;
`
const SubLine = styled.div<{ status: IndeterminateLoadingBarStatus }>`
  position: absolute;
  background: ${({ theme, status }) => getBarColor(status, theme)};
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

export function IndeterminateLoadingBar({ status }: { status: IndeterminateLoadingBarStatus }) {
  return (
    <Slider>
      <Line status={status} />
      {status === 'loading' && (
        <>
          <Inc status={status} />
          <Dec status={status} />
        </>
      )}
    </Slider>
  )
}
