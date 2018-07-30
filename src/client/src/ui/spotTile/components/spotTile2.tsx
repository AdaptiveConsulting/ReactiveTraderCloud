import React, { SFC } from 'react'
import { Flex, TradeButton } from 'rt-components'
import { Direction } from 'rt-types'
import { styled, withDefaultProps } from 'rt-util'

const Box = styled('div')`
  padding: 0;
  margin: 0;
`

const DirectionLabel = styled(Box)`
  color: ${p => p.theme.palette.secondary['0']};
  margin: 0 0 2px 0;
  opacity: 0.59;
  font-size: 10px;
`

const Tenth = styled(Box)`
  color: ${p => p.theme.palette.secondary['0']};
  font-size: ${p => p.theme.fontSize.h4};
`

const Big = styled(Box)`
  color: ${p => p.theme.palette.secondary['0']};
  font-size: ${p => p.theme.fontSize.h2};
  margin: 0 2px;
`

const Pip = styled(Box)`
  color: ${p => p.theme.palette.secondary['0']};
  margin: 2px 0;
  align-self: flex-end;
`
const defaultProps: PriceButtonProps = {
  big: '0',
  pip: '0',
  tenth: '0',
  direction: Direction.Buy
}

interface PriceButtonProps {
  big: string
  pip: string
  tenth: string
  direction: Direction
}

const PriceButtonComp: SFC<PriceButtonProps> = ({ big, pip, tenth, direction }) => (
  <TradeButton>
    <Flex height="34px" direction="row" justifyContent="center" alignItems="center">
      <Flex height="100%" direction="column" justifyContent="center">
        <DirectionLabel>{direction.toUpperCase()}</DirectionLabel>
        <Tenth>{tenth}</Tenth>
      </Flex>
      <Big>{big}</Big>
      <Pip>{pip}</Pip>
    </Flex>
  </TradeButton>
)

export const PriceButton = withDefaultProps(defaultProps, PriceButtonComp)
