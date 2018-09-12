import React from 'react'

import ColorBlocks from '../components/ColorBlocks'
import { Column, H2 } from '../elements'
import { Paragraph, SectionBlock } from '../styled'

export default props => (
  <SectionBlock py={2} {...props}>
    <H2>Full Color Spectrum</H2>
    <Paragraph>
      The following shows the full colour spectrum availble to be used within the application. Changing a base colour
      will show the variants available. These colurs are used to populate the basic style guide of the application.
    </Paragraph>
    <Column>
      <ColorBlocks />
    </Column>
  </SectionBlock>
)
