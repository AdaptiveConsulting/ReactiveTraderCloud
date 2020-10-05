import { storiesOf } from '@storybook/react'
import React from 'react'
import { Story } from 'rt-storybook'
import styled from 'styled-components/macro'
import ContactUsButton from './ContactUsButton'

const stories = storiesOf('Contact Us', module)

const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

stories.add('Contact Us', () => (
  <Root>
    <ContactUsButton />
  </Root>
))

const Root: React.FC = ({ children }) => (
  <Story>
    <Centered>{children}</Centered>
  </Story>
)
