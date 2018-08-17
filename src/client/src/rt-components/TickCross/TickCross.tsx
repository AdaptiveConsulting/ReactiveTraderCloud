import React from 'react'

import { Flex } from 'rt-components'
import { styled } from 'rt-util'

interface StyledTickCrossProps {
  isTick: boolean
}
const Icon = styled(Flex)<StyledTickCrossProps>`
  width: 24px;
  height: 24px;
  background-color: ${({ theme: { palette }, isTick }) => (isTick ? palette.accentGood.dark : palette.accentBad.dark)};
  border-radius: 50%;
  margin-right: 20px;
`
interface Props {
  isTick: boolean
}
const TickCross: React.SFC<Props> = ({ isTick }) => (
  <Icon isTick={isTick} alignItems="center" justifyContent="center">
    <i className={`fas fa-${isTick ? 'check' : 'times'}`} />
  </Icon>
)

export default TickCross
