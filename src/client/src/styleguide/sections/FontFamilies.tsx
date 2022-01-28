import { FC } from "react"
import styled from "styled-components"
import { H2, H3, H5 } from "../elements"
import { Paragraph, SectionBlock, Text, TextProps } from "../styled"

const SIZES: Array<
  [
    string,
    string,
    string,
    string,
    string,
    TextProps["fontSize"],
    TextProps["lineHeight"],
  ]
> = [
  ["H1", "Regular", "Left", "19px", "Sentence", 1.25, 1.25],
  ["H2", "Regular", "Left", "16px", "Sentence", 1, 1],
  ["H3", "Medium", "Left", "13px", "Sentence", 0.8125, 1],
  ["H4", "Bold", "Left", "10px", "All caps", 0.625, 1],
  ["SUBTITLE 1", "Medium", "Left", "10px", "All caps", 0.625, 1],
  ["Nav", "Medium", "Left", "13px", "Sentence", 0.8125, 1],
  ["Body 1", "Multiple*", "Mutiple", "12px", "Sentence", 0.75, 1],
  ["Body 2", "Multiple*", "Mutiple", "11px", "Sentence", 0.6875, 1],
  ["Button", "Medium", "Mutiple", "11px", "Sentence", 0.6875, 1],
  ["Caption", "Light italic", "Left", "11px", "Sentence", 0.6875, 1],
]

const CHARACTERS = [
  `ABCĆDEFGHIJKLMNOPQRSŠTUVWXYZŽ`,
  `abcćdefghijklmnopqrsštuvwxyzž`,
  `1234567890`,
  `‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*`,
].map((line) => line.split("").join(" "))

const LATO = {
  fontFamily: "lato",
  fontFaces: [
    { fontWeight: 100, advised: false, name: "Hairline" },
    { fontWeight: 200, advised: true, name: "Light" },
    { fontWeight: 500, advised: true, name: "Regular" },
    { fontWeight: 700, advised: true, name: "Bold" },
    { fontWeight: 900, advised: true, name: "Black" },
  ],
}

const ROBOTO = {
  fontFamily: "roboto",
  fontFaces: [
    { fontWeight: 100, advised: true, name: "Thin" },
    { fontWeight: 200, advised: true, name: "Extra Light" },
    { fontWeight: 300, advised: true, name: "Light" },
    { fontWeight: 400, advised: true, name: "Regular" },
    { fontWeight: 500, advised: true, name: "Medium" },
    { fontWeight: 600, advised: true, name: "Semi Bold" },
    { fontWeight: 700, advised: true, name: "Bold" },
    { fontWeight: 800, advised: true, name: "Extra Bold" },
    { fontWeight: 900, advised: true, name: "Black" },
  ],
}

export const FontFamilies: FC = () => (
  <>
    <SectionBlock>
      <H2 pt={4}>Typography</H2>
      <H3>Roboto</H3>

      <Paragraph>
        Roboto has a dual nature. It has a mechanical skeleton and the forms are
        largely geometric. At the same time, the font features friendly and open
        curves. While some grotesks distort their letterforms to force a rigid
        rhythm, Roboto doesn’t compromise, allowing letters to be settled into
        their natural width. This makes for a more natural reading rhythm more
        commonly found in humanist and serif types.
      </Paragraph>

      <FontFamilySample {...ROBOTO} />

      <H3>Font Sizes & Style Usage</H3>
      <FontSizeGridHeader>
        <H5>Category</H5>
        <H5>Font Styles</H5>
        <H5>Alignment</H5>
        <H5>Size</H5>
        <H5>Case</H5>
      </FontSizeGridHeader>
      {SIZES.map(
        ([
          label,
          fontWeight,
          alignment,
          fontSizeText,
          caps,
          fontSize,
          lineHeight,
        ]) => (
          <FontSizeGrid key={label}>
            <Text
              textColor={(theme) => theme.secondary[1]}
              fontSize={fontSize}
              lineHeight={1.5}
            >
              {label}
            </Text>
            <Text textColor={(theme) => theme.secondary[1]}>{fontWeight}</Text>
            <Text textColor={(theme) => theme.secondary[1]}>{alignment}</Text>
            <Text textColor={(theme) => theme.secondary[1]}>
              {fontSizeText}
            </Text>
            <Text textColor={(theme) => theme.secondary[1]}>{caps}</Text>
          </FontSizeGrid>
        ),
      )}
    </SectionBlock>
    <SectionBlock mh={0} py={0}>
      <Paragraph>
        <i>
          *Means there will often be regular, bold, medium, italic, underline
          styles available The above are the core set of available fonts and
          their styles. You should feel free to deviate to some degree, for
          example using a body style then amending the weight to bold, italic
          underlined etc.
        </i>
      </Paragraph>
    </SectionBlock>
  </>
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
          (line) =>
            <CharacterLine key={line}>{line}</CharacterLine> || (
              <>
                <CharacterLine>{line.slice(0, line.length / 2)}</CharacterLine>{" "}
                <CharacterLine>{line.slice(line.length / 2)}</CharacterLine>
                {"\n"}
              </>
            ),
        )}
      </CharacterMap>
    </div>
  </FontFamilySampleGrid>
)

const Heading: React.FC = (props) => (
  <Paragraph display="block" fontSize={1} lineHeight={2} mt={2} {...props} />
)

const FontFamilySampleGrid = styled(Text)<TextProps>`
  display: grid;
  grid-template-columns: minmax(auto, 0.2fr) 1fr;
  grid-column-gap: 5rem;
  max-width: 100%;
  overflow: hidden;
  margin: 3rem 0;
`

const Glyph: React.FC<{ fontFamily: string }> = (props) => (
  <div>
    <Heading>Glyph</Heading>
    <Paragraph fontSize={7.5} lineHeight={7.5} {...props} />
  </div>
)

const CharacterMap: React.FC<TextProps> = (props) => (
  <Text
    display="block"
    fontSize={1}
    fontWeight="bold"
    whiteSpace="pre-wrap"
    {...props}
  />
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
const FontSizeGridHeader = styled.div<{ children: any[] }>`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: minmax(25%, max-content) repeat(4, 1fr);
  grid-column-gap: 1rem;
  align-items: baseline;
  background-color: ${({ theme }) => theme.primary[2]};
  padding: 1rem;
`

const FontSizeGrid = styled.div<{ children: any[] }>`
  display: grid;
  border-bottom: 1px solid ${({ theme }) => theme.primary[2]};
  grid-template-rows: auto;
  grid-template-columns: minmax(25%, max-content) repeat(4, 1fr);
  grid-column-gap: 1rem;
  padding: 0.5rem 1rem;
  align-items: baseline;
`

export default FontFamilies
