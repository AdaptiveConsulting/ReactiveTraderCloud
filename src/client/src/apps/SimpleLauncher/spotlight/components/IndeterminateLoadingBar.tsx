import React, { FC } from 'react'
import styled, { DefaultTheme, keyframes } from 'styled-components/macro'

type Props = {
  status: 'rejected' | 'accepted' | undefined
  loading: boolean
}

const getBarColor = (status: Props['status'], theme: DefaultTheme) => {
  if (status === 'accepted') {
    return theme.colors.accents.positive.base
  }
  if (status === 'rejected') {
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
`
const Line = styled.div<{ status: Props['status']; loading: boolean }>`
  position: absolute;
  opacity: ${({ loading }) => (loading ? '0.4' : '1.0')};
  background: ${({ theme, status }) => getBarColor(status, theme)};
  width: 150%;
  height: 3px;
`
const SubLine = styled.div<{ status: Props['status'] }>`
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

export const IndeterminateLoadingBar: FC<Props> = ({ status, loading }) => {
  return (
    <Slider>
      <Line status={status} loading={loading} />
      {loading && (
        <>
          <Inc status={status} />
          <Dec status={status} />
        </>
      )}
    </Slider>
  )
}
