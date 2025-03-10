/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { rgba } from "polished"
import { ReactNode } from "react"
import {
  css,
  FlattenSimpleInterpolation,
  StyledComponent,
} from "styled-components"

import { Typography } from "@/client/components/Typography"
import { colors, Theme, ThemeName, useTheme } from "@/client/theme"
import { Color } from "@/client/theme/types"
import { UISK_Variables } from "@/client/theme/uisk/generatedTheme"

import { H2, H3, P } from "../elements"
import { BlockProps, SectionBlock } from "../styled"
import { Separator } from "./components"
import {
  AccentRowGrid,
  AccentSwatchGrid,
  CoreSwatchGrid,
  DominantAccentSwatchGrid,
  QuadrantLayout,
  SwatchColor,
  ThemeRow,
  UniqueRowGrid,
  UniqueSwatchGrid,
} from "./CoreBranding.styled"

export const CoreBranding = () => {
  const { themeName } = useTheme()

  const theme =
    themeName === ThemeName.Dark ? colors.newThemeDark : colors.newThemeLight

  return (
    <>
      <SectionBlock colorScheme="secondary">
        <H2>Colour</H2>
        <H3>Core UI</H3>
        <P>
          Core color control the general look and feel of the application and
          make up 90% of the overall UI aesthetic. When switching from a light
          to a dark theme these are the key color that change.
        </P>

        <ThemePalettes theme={theme} />

        <Separator />

        <QuadrantLayout>
          <span>
            <H3>Brand / Accent Colours</H3>
            <P>
              Brand colors aim to communicate a companies visual ownership of
              the digital product.
            </P>
          </span>
          <DominantAccentPalettes theme={theme} />
        </QuadrantLayout>

        <Separator />

        <QuadrantLayout>
          <span>
            <H3>Accents & Functional colors</H3>
            <P>
              Accent colors inject focus points in to the UI and are used to
              give the UI character and guide users attention. These colors
              often work with the brand helping to retain the ‘feeling’ of being
              from the same organisation but not always.
            </P>
          </span>

          <AccentPalettes theme={theme} />
        </QuadrantLayout>

        <Separator />

        <QuadrantLayout>
          <span>
            <H3>Unique Collections</H3>
            <P>
              Create separate references for key areas of the application such
              as trading directions.
            </P>
            <P variant="Text md/Regular italic" marginY="sm">
              Note: Why are some colours the same but named differently?
            </P>
            <P variant="Text md/Regular italic">
              Answer: These colours will be chosen and used in different
              situations allowing key functional colours and branding to be
              changed independantly of one another.
            </P>
          </span>

          <span>
            <UniquePalettes theme={theme} />
          </span>
        </QuadrantLayout>
      </SectionBlock>
    </>
  )
}

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
    <Typography variant="Text md/Semibold" textTransform="capitalize">
      {label}
    </Typography>
    <Typography variant="Text sm/Regular" textTransform="uppercase">
      {value}
    </Typography>
  </SwatchElement>
)

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
