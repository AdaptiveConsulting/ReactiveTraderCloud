import { storiesOf } from '@storybook/react'
import React from 'react'

// import { withKnobs } from '@storybook/addon-knobs'
import { Story } from 'rt-storybook'

import { styled } from 'rt-theme'
import { OpenFinChrome, OpenFinHeader } from './OpenFinChrome'

const stories = storiesOf('Openfin', module)

stories.add('Openfin chrome', () => (
  <Story>
    <Container>
      <OpenFinChrome>
        <OpenFinHeader close={() => {}} minimize={() => {}} maximize={() => {}} />
        <div>This is the Body</div>
      </OpenFinChrome>
    </Container>
  </Story>
))

const Container = styled.div`
  height: 150px;
  width: 300px;
`
