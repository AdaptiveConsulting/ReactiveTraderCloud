import React from 'react'

import ColorBlocks from '../components/ColorBlocks'
import { Column, H2 } from '../elements'
import { Paragraph, SectionBlock } from '../styled'

export default props => (
  <SectionBlock py={2} {...props}>
    <H2>Full Color Spectrum</H2>
    <Paragraph>
      The following shows the full color spectrum availble to be used within the application. Changing a base color will
      show the variants available. These colors are used to populate the basic style guide of the application.
    </Paragraph>
    <Column>
      <ColorBlocks />
    </Column>
  </SectionBlock>
)
