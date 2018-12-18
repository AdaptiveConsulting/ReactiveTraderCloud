import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

// import { withKnobs } from '@storybook/addon-knobs'
import { Story } from 'rt-storybook'

import { styled } from 'test-theme'
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum
          </p>
        </Body>
      </OpenFinChrome>
    </Container>
  </Story>
))

stories.add('Openfin Header', () => (
  <Story>
    <Container>
      <OpenFinHeader close={close} />
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
  height: 184px;
  width: 370px;
`
const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 2.5rem;
  width: 7.5rem;
  border: 1px solid red;
`

const Body = styled.div`
  display: flex;
  background-color: pink;
  height: 100%;
  width: 100%;
`
