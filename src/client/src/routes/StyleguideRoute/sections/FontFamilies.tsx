import React from 'react'
import { styled, Styled } from 'rt-theme'

import { H2, H3 } from '../elements'
import { Paragraph, SectionBlock, Text } from '../styled'

const SIZES = [
  ['Heading H1', 55, 3.5],
  ['Heading H2', 34, 2.5],
  ['Heading H3', 21, 1.5],
  ['Heading H4', 13, 1],
  ['Body', 11, 1],
  ['Caption', 8, 1]
]

export default props => (
  <React.Fragment>
    <SectionBlock mh={1}>
      <H2>Font Families</H2>
    </SectionBlock>
    <SectionBlock fontFamily="lato" intent="inverted" {...props}>
      <H3>Primary - LATO</H3>

      <Paragraph>
        Lato meaning ‘Summer’ in polish has a clear corporate but modern style that works really well in digital
        products. It is available for free as part of the open-source Open Font Licence and can be downloaded directly
        from Google fonts and used without restriction.
      </Paragraph>

      <Glyph>Aa</Glyph>
    </SectionBlock>
    <SectionBlock fontFamily="montserrat" intent="secondary" {...props}>
      <H3>Secondary - MONTSERRAT</H3>

      <Paragraph>
        Secondary fonts can be used if required to add interest to specific titles or summary data. Be sure to select a
        complimentary style that can work alongside the primary font. Montserrat has been chosen for it’s strong bold
        style at small font sizes. It is also available to be used without restriction from Google fonts.
      </Paragraph>

      <Glyph>Aa</Glyph>
    </SectionBlock>

    <SectionBlock mh={5}>
      <H2>Font Sizes</H2>
      <Paragraph>
        You should be free to select a font size that seems appropriate for the use however try to control the number of
        similar sized fonts used unless there really is a clear visual benefit. Defining a paragraph size is very
        important and can be used to define the headings and sub-heading sizes. Always ensure you are maintaining a
        clear hierarchy in your screen layout by using the correctly weighted and sized fonts.
      </Paragraph>
      <Paragraph fontStyle="italic" my={3}>
        <strong>Note</strong>: You can use the Fibonacci numbers to define the upper and lower font sizes. Starting from
        8, 13, 21, 34, 55, and then add minor increments inbetween as you see the need.
      </Paragraph>

      <Grid>
        {SIZES.map(([label, fontSize, lineHeight]) => (
          <React.Fragment>
            <Text color="secondary.1">
              {label} — {fontSize}
              px
            </Text>
            <Paragraph fontSize={(fontSize as number) / 16} lineHeight={lineHeight}>
              Adaptive Financial
            </Paragraph>
          </React.Fragment>
        ))}
      </Grid>
    </SectionBlock>
  </React.Fragment>
)

const Glyph = styled(Text)``
const Grid: Styled<{ children: any[] }> = styled.div`
  display: grid;

  grid-template-rows: auto;
  grid-template-columns: minmax(25%, max-content) 1fr;
  grid-column-gap: 1rem;
`
