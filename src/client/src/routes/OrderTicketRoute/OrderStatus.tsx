import _ from 'lodash'
import React from 'react'
import { styled } from 'rt-theme'

import { Button as StyleguideButton } from 'rt-styleguide'
import { Block, Text } from '../StyleguideRoute/styled'
import { LabelText } from './TextField'

export interface Props {
  ready?: boolean
}

interface State extends Props {
  prev: Props | null
}

export { Props as OrderStatusProps }
export class OrderStatus extends React.Component<Props, State> {
  state: State = {
    prev: null,
  }

  static getDerivedStateFromProps(props: Props, state: State): any {
    return null
  }

  render() {
    const { ready } = this.props
    return (
      <React.Fragment>
        <StatusLayout fg="muteColor">
          <div>
            <LabelText>Status</LabelText>
            <StatusText>{ready ? 'Draft' : '— —'}</StatusText>
          </div>
          <div>
            <LabelText>Remaining</LabelText>
            <StatusText>— —</StatusText>
          </div>
          <Progress>
            <Block>&nbsp;</Block>
            <StatusText>— —</StatusText>
          </Progress>
        </StatusLayout>
        <ButtonLayout>
          <Button intent={ready ? 'good' : 'mute'} disabled={!ready}>
            Submit
          </Button>
          <Button intent="mute" disabled={!ready}>
            Cancel
          </Button>
        </ButtonLayout>
      </React.Fragment>
    )
  }
}

const StatusLayout = styled(Block)`
  display: grid;
  grid-gap: 0.5rem;
  padding: 0 1rem;
  height: 50%;
  grid-template-columns: 1fr 1fr auto;
  grid-template-rows: auto;
  /* align-items: center; */
  /* justify-content: center; */
  align-content: center;
  box-shadow: 0 -1px 0 0 ${props => props.theme.ruleColor} inset;
`

const StatusText = styled(Block)`
  line-height: 1.5rem;
`

const Progress = styled(Block)`
  position: relative;
  width: 2rem;
  margin: 0 1rem;
  display: grid;
  align-content: center;
  &::before {
    content: '';
    position: absolute;
    top: -0.75rem;
    left: -1.25rem;
    height: 4rem;
    width: 4rem;
    box-shadow: 0 0 0 0.25rem ${props => props.theme.primary.base};
    border-radius: 100%;
  }
`

const ButtonLayout = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  padding: 0 1rem;
  height: 50%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  align-items: center;
  justify-content: center;
  align-content: center;
  justify-items: center;
`

const Button = styled(StyleguideButton)`
  min-height: 4rem;
  max-height: 4rem;
  min-width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
`
