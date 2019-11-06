import React from 'react'
import { styled } from 'rt-theme'

import { H2, H3 } from '../elements'
import { Paragraph, SectionBlock, Text, TextProps } from '../styled'
import { css } from 'styled-components'

const SIZES: Array<[string, TextProps['fontSize'], TextProps['lineHeight']]> = [
  ['Heading H1', 3.4375, 3.5],
  ['Heading H2', 2.125, 2.5],
  ['Heading H3', 1.3125, 1.5],
  ['Heading H4', 0.8125, 1],
  ['Body', 0.6875, 1],
  ['Caption', 0.5, 1],
]

const CHARACTERS = [
  `ABCĆDEFGHIJKLMNOPQRSŠTUVWXYZŽ`,
  `abcćdefghijklmnopqrsštuvwxyzž`,
  `1234567890`,
  `‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*`,
].map(line => line.split('').join(' '))

const LATO = {
  fontFamily: 'lato',
  fontFaces: [
    { fontWeight: 100, advised: false, name: 'Hairline' },
    { fontWeight: 200, advised: true, name: 'Light' },
    { fontWeight: 500, advised: true, name: 'Regular' },
    { fontWeight: 700, advised: true, name: 'Bold' },
    { fontWeight: 900, advised: true, name: 'Black' },
  ],
}

const MONTSERRAT = {
  fontFamily: 'montserrat',
  fontFaces: [
    { fontWeight: 100, advised: true, name: 'Thin' },
    { fontWeight: 200, advised: true, name: 'Extra Light' },
    { fontWeight: 300, advised: true, name: 'Light' },
    { fontWeight: 400, advised: true, name: 'Regular' },
    { fontWeight: 500, advised: true, name: 'Medium' },
    { fontWeight: 600, advised: true, name: 'Semi Bold' },
    { fontWeight: 700, advised: true, name: 'Bold' },
    { fontWeight: 800, advised: true, name: 'Extra Bold' },
    { fontWeight: 900, advised: true, name: 'Black' },
  ],
}

export const FontFamilies: React.FC = () => (
  <React.Fragment>
    <SectionBlock mh={1}>
      <H2>Font Families</H2>
    </SectionBlock>
    <SectionBlock colorScheme="inverted">
      <H3>Primary — LATO</H3>

      <Paragraph>
        Lato meaning ‘Summer’ in polish has a clear corporate but modern style that works really
        well in digital products. It is available for free as part of the open-source Open Font
        Licence and can be downloaded directly from Google fonts and used without restriction.
      </Paragraph>
      <FontFamilySample {...LATO} />
    </SectionBlock>
    <SectionBlock colorScheme="secondary">
      <H3>Secondary — MONTSERRAT</H3>

      <Paragraph>
        Secondary fonts can be used if required to add interest to specific titles or summary data.
        Be sure to select a complimentary style that can work alongside the primary font. Montserrat
        has been chosen for it’s strong bold style at small font sizes. It is also available to be
        used without restriction from Google fonts.
      </Paragraph>

      <FontFamilySample {...MONTSERRAT} />
    </SectionBlock>

    <SectionBlock mh={5}>
      <H2>Font Sizes</H2>
      <Paragraph>
        You should be free to select a font size that seems appropriate for the use however try to
        control the number of similar sized fonts used unless there really is a clear visual
        benefit. Defining a paragraph size is very important and can be used to define the headings
        and sub-heading sizes. Always ensure you are maintaining a clear hierarchy in your screen
        layout by using the correctly weighted and sized fonts.
      </Paragraph>
      <Paragraph fontStyle="italic" my={3}>
        <strong>Note</strong>: You can use the Fibonacci numbers to define the upper and lower font
        sizes. Starting from 8, 13, 21, 34, 55, and then add minor increments inbetween as you see
        the need.
      </Paragraph>

      <FontSizeGrid>
        {SIZES.map(([label, fontSize, lineHeight]) => (
          <React.Fragment key={label}>
            <Text textColor={theme => theme.secondary[1]}>
              {label} — {fontSize && fontSize * 16 /* Assuming :root font-size is 16px!*/}
              px
            </Text>
            <Paragraph fontSize={fontSize} lineHeight={lineHeight}>
              Adaptive Financial
            </Paragraph>
          </React.Fragment>
        ))}
      </FontSizeGrid>
    </SectionBlock>
  </React.Fragment>
)

const FontFamilySample: React.FC<{
  fontFamily: string
  fontFaces: typeof LATO.fontFaces
  characters?: string[]
}> = ({ fontFamily, fontFaces, characters = CHARACTERS, ...props }) => (
  <FontFamilySampleGrid {...props}>
    <Glyph fontFamily={fontFamily}>Aa</Glyph>
    <div>
      <Heading>Characters</Heading>
      <CharacterMap>
        {CHARACTERS.map(
          line =>
            <CharacterLine key={line}>{line}</CharacterLine> || (
              <React.Fragment>
                <CharacterLine>{line.slice(0, line.length / 2)}</CharacterLine>{' '}
                <CharacterLine>{line.slice(line.length / 2)}</CharacterLine>
                {'\n'}
              </React.Fragment>
            ),
        )}
      </CharacterMap>
      <Heading>Styles</Heading>
      <FontWeightGrid fontSize={1} lineHeight={2} fontFamily={fontFamily}>
        {fontFaces.map(face => (
          <div key={face.name} style={{ width: 'min-content' }}>
            <FontWeight {...face}>{face.name}</FontWeight>
            <FontWeight {...face} fontStyle="italic">
              {face.name}
            </FontWeight>
          </div>
        ))}
      </FontWeightGrid>
    </div>
  </FontFamilySampleGrid>
)

const Heading: React.FC = props => (
  <Paragraph display="block" fontSize={1} lineHeight={2} mt={2} {...props} />
)

const FontFamilySampleGrid = styled(Text)<TextProps>`
  display: grid;
  grid-template-columns: minmax(auto, 0.2fr) 1fr;
  grid-column-gap: 1rem;
  max-width: 100%;
  overflow: hidden;
`

const Glyph: React.FC<{ fontFamily: string }> = props => (
  <div>
    <Heading>Glyph</Heading>
    <Paragraph fontSize={5} lineHeight={5} fontWeight="bold" {...props} />
  </div>
)

const CharacterMap: React.FC<TextProps> = props => (
  <Text display="block" fontSize={1} fontWeight="bold" whiteSpace="pre-wrap" {...props} />
)

const CharacterLine = styled.div`
  line-height: 1.875rem;
  font-size: 1.125rem;
  letter-spacing: 0.125rem;

  @media all and (max-width: 480px) {
    max-width: 90%;
    line-height: 1.5rem;
    margin-bottom: 0.75rem;
  }
  @media all and (min-width: 640px) {
  }
`

const FontWeightGrid = styled(Text)<TextProps>`
  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-rows: auto;
  grid-template-columns: repeat(auto-fill, minmax(calc(50% - 1rem), 1fr));

  @media all and (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(calc(33% - 1rem), 1fr));
  }

  @media all and (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(calc(20% - 1rem), 1fr));
  }
`

const FontWeight = styled(Text)<{ advised: boolean } & TextProps>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  width: min-content;

  ${({ advised }) =>
    advised &&
    css`
      position: relative;

      &:after {
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0);
      }
    `};
`

const FontSizeGrid = styled.div<{ children: any[] }>`
  display: grid;

  grid-template-rows: auto;
  grid-template-columns: minmax(25%, max-content) 1fr;
  grid-column-gap: 1rem;

  align-items: baseline;
`

export default FontFamilies
