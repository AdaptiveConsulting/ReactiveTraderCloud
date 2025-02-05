/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { rgba } from "polished"
import { ReactNode } from "react"
import styled, {
  css,
  FlattenSimpleInterpolation,
  StyledComponent,
} from "styled-components"

import { Gap } from "@/client/components/Gap"
import { Typography } from "@/client/components/Typography"
import { colors, Theme, ThemeName, useTheme } from "@/client/theme"
import { Color } from "@/client/theme/types"
import { UISK_Variables } from "@/client/theme/uisk/generatedTheme"

import { Block, BlockProps, SectionBlock, Text } from "../styled"

export const CoreBranding = () => {
  const { themeName } = useTheme()

  const theme =
    themeName === ThemeName.Dark ? colors.newThemeDark : colors.newThemeLight

  return (
    <>
      <SectionBlock colorScheme="secondary" mh={2} pt={2}>
        <Typography
          variant="Display md/Regular"
          textTransform="uppercase"
          color="Colors/Text/text-brand-primary (900)"
          allowLineHeight
        >
          Colour
        </Typography>
        <Typography
          variant="Display xs/Regular"
          allowLineHeight
          marginBottom="sm"
        >
          Core UI
        </Typography>
        <Typography variant="Text lg/Regular">
          Core color control the general look and feel of the application and
          make up 90% of the overall UI aesthetic. When switching from a light
          to a dark theme these are the key color that change.
        </Typography>

        <ThemePalettes theme={theme} />

        <Separator />

        <QuadrantLayout>
          <span>
            <Typography
              variant="Display xs/Regular"
              marginBottom="sm"
              allowLineHeight
            >
              Brand / Accent Colours
            </Typography>
            <Typography variant="Text lg/Regular">
              Brand colors aim to communicate a companies visual ownership of
              the digital product.
            </Typography>
          </span>
          <DominantAccentPalettes theme={theme} />
        </QuadrantLayout>

        <Separator />

        <QuadrantLayout>
          <span>
            <Typography
              variant="Display xs/Regular"
              marginBottom="sm"
              allowLineHeight
            >
              Accents & Functional colors
            </Typography>
            <Typography variant="Text lg/Regular">
              Accent colors inject focus points in to the UI and are used to
              give the UI character and guide users attention. These colors
              often work with the brand helping to retain the ‘feeling’ of being
              from the same organisation but not always.
            </Typography>
          </span>

          <AccentPalettes theme={theme} />
        </QuadrantLayout>

        <Separator />

        <QuadrantLayout>
          <span>
            <Typography
              variant="Display xs/Regular"
              marginBottom="sm"
              allowLineHeight
            >
              Unique Collections
            </Typography>
            <Typography variant="Text lg/Regular" marginBottom="sm">
              Create separate references for key areas of the application such
              as trading directions.
            </Typography>
            <Gap height="sm" />
            <Typography variant="Text lg/Regular italic" marginBottom="sm">
              Note: Why are some colours the same but named differently?
            </Typography>
            <Typography variant="Text lg/Regular italic">
              Answer: These colours will be chosen and used in different
              situations allowing key functional colours and branding to be
              changed independantly of one another.
            </Typography>
          </span>

          <span>
            <UniquePalettes theme={theme} />
          </span>
        </QuadrantLayout>
      </SectionBlock>
    </>
  )
}

const Separator = styled.div`
  height: 1px;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Border/border-primary"]};
`

const PaletteLayout = ({
  grid: SwatchGrid,
  fg,
  label: paletteLabel,
  palette,
  include,
  base,
  codes = {},
}: {
  grid?: StyledComponent<React.ComponentType<any>, Theme, any>
  fg: string
  label: string
  palette: any
  include: Color[]
  base?: Array<number>
  codes?: object
}) => {
  if (!SwatchGrid) {
    return <></>
  }
  return (
    <SwatchGrid style={{ boxShadow: `0px 0px 20px 0px ${rgba(0, 0, 0, 0.2)}` }}>
      {include.map((key, i) => {
        const color = palette[key]

        const themeForCss: any = {
          justifyContent: "center",
        }

        if (base?.includes(i) && i === 0) {
          themeForCss.gridArea = "base"
        }
        if (base?.includes(i) && i === 1) {
          themeForCss.gridArea = "base1"
        }

        return (
          <Swatch
            key={key}
            extra={css(themeForCss)}
            label={`${paletteLabel}${i === 0 ? "" : `-${i}`}`}
            value={color}
            // @ts-ignore
            code={codes[key] || key}
            bg={() => color}
            fg={() => fg}
          />
        )
      })}
    </SwatchGrid>
  )
}

export interface SwatchColorProps {
  extra?: FlattenSimpleInterpolation
}

export interface SwatchProps extends BlockProps, SwatchColorProps {
  className?: string
  style?: object
  is?: StyledComponent<React.ComponentType<any>, Theme, SwatchColorProps>
  label?: string
  value?: string
  code?: string
  toStyle?: React.CSSProperties
  extra?: FlattenSimpleInterpolation
  children?: ReactNode
}

export const Swatch = ({
  is: SwatchElement = SwatchColor,
  label,
  value,
  bg,
  fg,
  ...props
}: SwatchProps) => (
  <SwatchElement p={1} bg={bg} fg={fg} {...props}>
    <Text fontSize={0.75} fontWeight="bold" textTransform="capitalize">
      {label}
    </Text>
    <Text fontSize={0.75} textTransform="uppercase">
      {value}
    </Text>
  </SwatchElement>
)

export const SwatchColor = styled(Block)<SwatchColorProps>`
  line-height: 1.25rem;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;
  padding-right: 5px;

  ${({ extra }) => extra};
`

export const LargeSwatchColor = styled(SwatchColor)<SwatchColorProps>`
  width: 14rem;
  height: 10rem;
  margin: 1.5rem 0;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;

  border-radius: 0.5rem;
`

const CoreSwatchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, 5rem);
  grid-template-areas:
    "base 2"
    "base 3"
    "base1 4"
    "base1 5";

  overflow: hidden;
  border-radius: 0.5rem;

  ${SwatchColor} {
    border-radius: initial;
  }

  @media all and (min-width: 640px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 10rem 7rem;
    grid-template-areas:
      "base base base1 base1"
      "2 3 4 5";
  }
`

type Colors = UISK_Variables["1. Color modes"]

const ThemePalettes = ({ theme }: { theme: Colors }) => {
  const bgPalette: Color[] = [
    "Colors/Background/bg-primary",
    "Colors/Background/bg-primary_alt",
    "Colors/Background/bg-secondary",
    "Colors/Background/bg-tertiary",
    "Colors/Background/bg-quaternary",
    "Colors/Background/bg-secondary-solid",
  ]

  const fgPalette: Color[] = [
    "Colors/Foreground/fg-primary (900)",
    "Colors/Foreground/fg-secondary (700)",
    "Colors/Foreground/fg-tertiary (600)",
    "Colors/Foreground/fg-quaternary (500)",
    "Colors/Foreground/fg-quinary (400)",
    "Colors/Foreground/fg-senary (300)",
  ]

  return (
    <ThemeRow>
      <PaletteLayout
        grid={CoreSwatchGrid}
        label="Background"
        palette={theme}
        fg={theme["Colors/Text/text-primary (900)"]}
        include={bgPalette}
        base={[0, 1]}
      />
      <PaletteLayout
        grid={CoreSwatchGrid}
        label="Foreground"
        palette={theme}
        fg={theme["Colors/Text/text-primary_alt"]}
        include={fgPalette}
        base={[0, 1]}
      />
    </ThemeRow>
  )
}

const ThemeRow = styled.div`
  margin: 2rem 0;

  display: grid;
  grid-gap: 0.5rem;
  @media all and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;

    ${CoreSwatchGrid}:first-child {
      border-radius: 0.5rem 0.5rem 0.5rem 0.5rem !important;
    }

    ${CoreSwatchGrid}:last-child {
      border-radius: 0.5rem 0.5rem 0.5rem 0.5rem !important;
    }
  }
`

const QuadrantLayout = styled.div`
  margin: 30px 0px;
  display: grid;
  grid-row-gap: 1rem;
  grid-column-gap: 0.5rem;

  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;

  @media all and (max-width: 800px) {
    grid-template-columns: auto;
  }
`

const DominantAccentPalettes = ({ theme }: { theme: Colors }) => {
  const brandPalette: Color[] = [
    "Colors/Background/bg-brand-secondary",
    "Colors/Background/bg-brand-primary",
    "Colors/Text/text-brand-primary (900)",
  ]
  return (
    <AccentRowGrid>
      <PaletteLayout
        key="dominant"
        grid={DominantAccentSwatchGrid}
        label="Brand"
        palette={theme}
        fg="#FFF"
        include={brandPalette}
        base={[0]}
      />
    </AccentRowGrid>
  )
}

type KeyedPalettes = { [k: string]: Color[] }

const AccentPalettes = ({ theme }: { theme: Colors }) => {
  const accents: KeyedPalettes = {
    positive: [
      "Component colors/Utility/Data/utility-data-positive-100",
      "Component colors/Utility/Data/utility-data-positive-300",
      "Component colors/Utility/Data/utility-data-positive-500",
      "Component colors/Utility/Data/utility-data-positive-700",
    ],
    warning: [
      "Colors/Background/bg-warning-primary",
      "Colors/Background/bg-warning-secondary",
      "Component colors/Utility/Warning/utility-warning-300",
      "Colors/Foreground/fg-warning-secondary",
    ],
    error: [
      "Colors/Text/text-error-primary (600)",
      "Colors/Background/bg-error-secondary",
      "Component colors/Utility/Error/utility-error-300",
      "Colors/Foreground/fg-error-primary",
    ],
  }

  return (
    <AccentRowGrid>
      {Object.entries(accents).map(([name, accent]) => (
        <PaletteLayout
          key={name}
          grid={AccentSwatchGrid}
          label={`Accent-${name}`}
          palette={theme}
          fg={name === "error" ? "#fff" : "#000"}
          include={accent}
        />
      ))}
    </AccentRowGrid>
  )
}

const AccentRowGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr;
  grid-template-rows: 6rem;
`

const AccentSwatchGrid = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  display: grid;
  grid-template-rows: 6rem;
  grid-template-areas: "base darker medium lighter";
`

const DominantAccentSwatchGrid = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  display: grid;
  grid-template-columns: 49% 26% 25%;
  grid-template-areas: "base darker lighter";
`

const UniquePalettes = ({ theme }: { theme: Colors }) => {
  const palettes: KeyedPalettes = {
    sell: [
      "Colors/Text/text-sell-primary",
      "Colors/Background/bg-sell-primary",
      "Colors/Background/bg-sell-primary_hover",
    ],
    buy: [
      "Colors/Text/text-buy-primary",
      "Colors/Background/bg-buy-primary",
      "Colors/Background/bg-buy-primary_hover",
    ],
  }
  return (
    <UniqueRowGrid>
      {Object.entries(palettes).map(([label, palette]) => (
        <PaletteLayout
          key={label}
          grid={UniqueSwatchGrid}
          label={label}
          palette={theme}
          fg="#fff"
          include={palette}
        />
      ))}
    </UniqueRowGrid>
  )
}

const UniqueRowGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 75%;
  margin-bottom: 1rem;
`

const UniqueSwatchGrid = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  height: min-content;
  display: grid;
  grid-template-rows: 6rem;
  grid-template-columns: 40% 30% 30%;
  grid-template-areas: "base 1 2";
`
