import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

// import { withKnobs } from '@storybook/addon-knobs'
import { Story } from 'rt-storybook'

import { styled } from 'rt-theme'
import { OpenFinChrome, OpenFinControls, OpenFinHeader } from './OpenFinChrome'

const stories = storiesOf('Openfin', module)
const close = action('onCLose')
const minimize = action('onMinimize')
const maximize = action('onMaximize')

stories.add('Openfin chrome', () => (
  <Story>
    <Container>
      <OpenFinChrome>
        <OpenFinHeader close={close} minimize={minimize} maximize={maximize} />
        <Body>
          <p>This is the Body</p>
          <p>More Body</p>
        </Body>
      </OpenFinChrome>
    </Container>
  </Story>
))

stories.add('Openfin Header', () => (
  <Story>
    <Container>
      <OpenFinHeader close={close} minimize={minimize} maximize={maximize} />
    </Container>
  </Story>
))

stories.add('Openfin Controls', () => (
  <Story>
    <ControlsContainer>
      <OpenFinControls close={close} minimize={minimize} maximize={maximize} />
    </ControlsContainer>
  </Story>
))

const Container = styled.div`
  height: 155px;
  width: 370px;
  border: 1px solid red;
`
const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 2.5rem;
  width: 7.5rem;
  border: 1px solid red;
`

const Body = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  background-color: white;
`
