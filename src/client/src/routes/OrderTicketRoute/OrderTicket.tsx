import { darken } from 'polished'
import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

export class OrderTicket extends PureComponent {
  render() {
    return (
      <Viewport fg="shell.textColor" bg="shell.backgroundColor">
        <AppLayout bg="shell.backgroundColor">
          <ChromeLayout bg="primary.base" />
          <DrawerLayout bg="primary.4" />
          <VoiceLayout />
          <FormLayout />
          <StatusLayout />
          <InfoLayout
          // bg="accents.accent.base"
          />
        </AppLayout>
      </Viewport>
    )
  }
}

const Viewport = styled(Block)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  height: 100%;
`

const AppLayout = styled(Block)`
  display: grid;
  min-width: 42rem;
  min-height: 22rem;

  border-radius: 0.5rem;
  overflow: hidden;

  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05),
    0 1rem 2.5rem -1.25rem ${({ theme }) => darken(0.1, theme.overlay.backgroundColor)};

  grid-template-columns: 4rem auto 0.75fr auto 1fr;
  grid-template-rows: 2rem 5rem 7rem 7rem 3rem;
  grid-template-areas:
    'chrome chrome chrome chrome chrome '
    'drawer voice  voice  voice  voice  '
    'drawer form   form   status status '
    'drawer form   form   status status '
    'drawer info   info   info   info   ';
`

const ChromeLayout = styled(Block)`
  grid-area: chrome;
  height: 2rem;
`
const DrawerLayout = styled(Block)`
  grid-area: drawer;
  width: 4rem;
`
const VoiceLayout = styled(Block)`
  grid-area: voice;
  height: 5rem;
  box-shadow: 0 1px 0 ${props => props.theme.ruleColor};
`
const FormLayout = styled(Block)`
  grid-area: form;
  height: 14rem;
  box-shadow: -1px 0 0 ${props => props.theme.ruleColor} inset;
`

const StatusLayout = styled(Block)`
  grid-area: status;
  height: 14rem;
`
const InfoLayout = styled(Block)`
  grid-area: info;
  height: 3rem;

  box-shadow: 0 1px 0 ${props => props.theme.ruleColor} inset;
`

export default OrderTicket
