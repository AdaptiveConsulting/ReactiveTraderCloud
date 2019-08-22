import React from 'react'

import ButtonGrid from '../components/ButtonGrid'
import { H2, H3, H5, NumberedLayout } from '../elements'
import { Paragraph, SectionBlock } from '../styled'

export const layout = React.Fragment
export const props = {}

export default () => (
  <React.Fragment>
    <SectionBlock colorScheme="secondary" mh={3}>
      <NumberedLayout number="2">
        <H5>Design Systems</H5>
        <H3>Adaptive UI Library</H3>
        <Paragraph>Basic controls of a user interface</Paragraph>
      </NumberedLayout>
    </SectionBlock>

    <SectionBlock mh={3}>
      <H2>Atoms</H2>
      <Paragraph>
        Atoms are the lowest level of a UI such as a button, text link, input field etc. Atoms are placed together to
        create a specific piece of functionality. All controls are scalable in height and width so as to accomodate a
        compact or spacious UI preference.
      </Paragraph>
    </SectionBlock>

    <SectionBlock colorScheme="secondary" py={2} bleeds>
      <H3>Buttons</H3>
      <ButtonGrid />
    </SectionBlock>
  </React.Fragment>
)
