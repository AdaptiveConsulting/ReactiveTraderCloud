import { Typography } from "@/client/components/Typography"
import { Spacing, TextStyles } from "@/client/theme/types"

import { H2, H3 } from "../elements"
import { SectionBlock } from "../styled"
import {
  CharacterLine,
  FontFamilySampleGrid,
  Table,
} from "./FontFamilies.styled"

const CATEGORIES = ["Text", "Display"]
const styles: { [k in (typeof CATEGORIES)[number]]: string[] } = {
  Text: [
    "Regular",
    "Regular italic",
    "Medium",
    "Medium italic",
    "Semibold",
    "Semibold italic",
    "Bold",
    "Bold italic",
  ],
  Display: ["Regular", "Medium", "Semibold", "Bold"],
}
const SHARED_SIZES: Spacing[] = ["xs", "sm", "md", "lg", "xl"]
const sizes: { [k in (typeof CATEGORIES)[number]]: Spacing[] } = {
  Text: ["xxs", ...SHARED_SIZES],
  Display: [...SHARED_SIZES, "2xl"],
}

const CHARACTERS = [
  `ABCĆDEFGHIJKLMNOPQRSŠTUVWXYZŽ`,
  `abcćdefghijklmnopqrsštuvwxyzž`,
  `1234567890`,
  `‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*`,
].map((line) => line.split("").join(" "))

export const FontFamilies = () => (
  <>
    <SectionBlock>
      <H2>Typography</H2>
      <H3>Work Sans</H3>

      <FontFamilySample />

      <H3 paddingY="lg">Font Sizes & Style Usage</H3>

      {CATEGORIES.map((category) => (
        <Table key={category}>
          <thead>
            <tr>
              <th scope="col">
                <Typography variant="Display md/Semibold">
                  {category}
                </Typography>
              </th>
            </tr>
            <tr>
              <th scope="col">
                <Typography variant="Display xs/Semibold">Size</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes[category].map((size) => {
              return (
                <tr key={size}>
                  <td>
                    {" "}
                    <Typography
                      variant={`${category} ${size}/Regular` as TextStyles}
                    >
                      {size}
                    </Typography>
                  </td>
                  {styles[category].map((style) => {
                    return (
                      <td key={style}>
                        <Typography
                          variant={`${category} ${size}/${style}` as TextStyles}
                        >
                          {style}
                        </Typography>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
      ))}
    </SectionBlock>
    <SectionBlock mh={0} py={0}>
      <Typography variant="Text sm/Regular italic">
        {`*Means there will often be regular, bold, medium, italic, underline
          styles available.
          The above are the core set of available fonts and
          their styles.
          You should feel free to deviate to some degree, for
          example using a body style then amending the weight to bold, italic
          underlined etc.`}
      </Typography>
    </SectionBlock>
  </>
)

const FontFamilySample = () => (
  <FontFamilySampleGrid marginY="5xl">
    <div>
      <Typography variant="Text xl/Regular">Glyph</Typography>
      <Typography fontSize={100}>Aa</Typography>
    </div>
    <div>
      <Typography variant="Text xl/Regular" marginBottom="sm">
        Characters
      </Typography>
      <Typography variant="Display sm/Regular">
        {CHARACTERS.map((line) => (
          <CharacterLine key={line} paddingBottom="xs">
            {line}
          </CharacterLine>
        ))}
      </Typography>
    </div>
  </FontFamilySampleGrid>
)

export default FontFamilies
