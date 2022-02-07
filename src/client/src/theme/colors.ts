import { mix, rgb, rgba } from "polished"
import { Direction } from "@/services/trades"

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// 1. Colors ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
export type Color = string

/*----------------------------- 1.1 Single colors ----------------------------*/

// Some designs will redefine white to achieve different
// visual effects on the viewers eyes.
const WHITE: Color = rgb(255, 255, 255)

// The same is true for black -- because we do not encounter
// true black or true white in natural conditions designs
// employing them in their primary palettes will be
// less appealing to most people.
const BLACK: Color = rgb(0, 0, 0)
// The meaning of transparent varies based on platform.
//
// Unlike most browsers Apple defines transparent as
//  rgba(0, 0, 0, 0) instead of rgba(255, 255, 255, 0)
//
// You will see this if you transition from or to
// transparency in a gradient or animation.
const TRANSPARENT: Color = rgba(255, 255, 255, 0)

// For these reasons designers will choose an
// offwhite and offblack color to set the
// range on their designs.
//
// They may reserve the use of true white to
// contrast with offwhite and draw attention
// to an input or button. Or a subtle boundary
// between elements.
const OFFWHITE = rgb(244, 246, 249)
const OFFBLACK = rgb(68, 76, 95) // sRGB
const BRAND = rgb(42, 87, 141) // Adaptive blue a.k.a. #2A578D

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// 2. Palettes //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//Kept for backward compatibility purposes. Current palette is not generated from one color

interface BasePalette {
  base: Color
}

export type LightShade =
  | "L95"
  | "L9"
  | "L8"
  | "L7"
  | "L6"
  | "L5"
  | "L4"
  | "L3"
  | "L2"
  | "L1"
type LightShadeSet = { [shade in LightShade]: Color }
export type DarkShade =
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "D5"
  | "D6"
  | "D7"
  | "D8"
  | "D9"
  | "D95"
type DarkShadeSet = { [shade in DarkShade]: Color }
type PaletteShadeSet = LightShadeSet & DarkShadeSet
/**
 * A basic palette formed by a `base` color plus:
 * - a number of darker (D1..D95) shades
 * - a number of lighter (L1..L95) shades
 */
export type ColorPalette = BasePalette & PaletteShadeSet

/*-------------------------- 2.1 Base color palettes -------------------------*/

// We use a base color to generate a complement
// of shades above and below at 10% increments.
const offblack = createPalette(OFFBLACK, {
  // We can override the generated shades.
  L3: mix(0.25, WHITE, rgb(85, 93, 112)),
  // We are overriding these values due to insuffcient contrast ratiobes
  // and inconsistency with the designers intent.
  D3: rgb(46, 53, 67),
  D4: rgb(39, 45, 58),
})
const blue = createPalette(rgb(81, 147, 253), { L95: OFFWHITE })

const red = createPalette(rgb(255, 53, 66))

const yellow = createPalette(
  rgb(255, 184, 40),
  // We are overriding the value for L1 due to insuffcient contrast
  // and inconsistency with the designers intent.
  { L1: rgb(241, 193, 109) },
)

const green = createPalette(rgb(0, 205, 130))

const brand = createPalette(BRAND)

/*---------------------------- 2.2 Core palettes -----------------------------*/

type CorePaletteVariant = "base" | 1 | 2 | 3 | 4 | 5

/**
 * A palette consisting of a `base` and 5 variants
 */

export type CorePalette = { [variant in CorePaletteVariant]: Color }

/* TODO: Find a more suitable name */
interface SemanticColors {
  lightBackground: Color
  darkBackground: Color
  alternateBackground: Color
  offBackground: Color
  textColor: Color
  backgroundHoverColor: Color
  primaryStyleGuideBackground: Color
  secondaryStyleGuideBackground: Color
  dividerColor: Color
  activeColor: Color
}

export interface CorePaletteMap {
  primary: CorePalette
  secondary: CorePalette
  core: SemanticColors
}

// New color definition based on custom rgb colors, not from colorPalettes generated before
const darkPrimary = {
  base: rgb(40, 46, 57),
  1: rgb(47, 53, 66),
  2: rgb(61, 68, 85),
  3: rgb(83, 87, 96),
  4: rgb(104, 109, 116),
  5: rgb(126, 129, 136),
  6: rgb(52, 58, 71),
}

const darkSecondary = {
  base: WHITE,
  1: rgb(249, 249, 249),
  2: rgb(243, 243, 244),
  3: rgb(228, 229, 230),
  4: rgb(207, 208, 211),
  5: rgb(189, 190, 195),
}

export const dark: CorePaletteMap = {
  primary: darkPrimary,
  secondary: darkSecondary,
  core: {
    lightBackground: darkPrimary[1],
    darkBackground: darkPrimary.base,
    alternateBackground: darkPrimary[3],
    offBackground: darkPrimary[3],
    textColor: darkSecondary.base,
    backgroundHoverColor: darkPrimary[2],
    primaryStyleGuideBackground: rgb(32, 36, 45),
    secondaryStyleGuideBackground: rgb(40, 45, 57),
    dividerColor: darkPrimary[6],
    activeColor: rgb(95, 148, 245),
  },
}

export const light: CorePaletteMap = {
  primary: darkSecondary,
  secondary: darkPrimary,
  core: {
    lightBackground: darkSecondary.base,
    darkBackground: darkSecondary[1],
    alternateBackground: darkSecondary[3],
    offBackground: darkSecondary[3],
    textColor: darkPrimary.base,
    backgroundHoverColor: rgb(212, 221, 232),
    primaryStyleGuideBackground: rgb(253, 253, 253),
    secondaryStyleGuideBackground: rgb(243, 243, 243),
    dividerColor: darkSecondary[3],
    activeColor: rgb(233, 237, 243),
  },
}

/*--------------------------- 2.3 Accent palettes ----------------------------*/

/**
 * A theme agnostic palette consisting of a `base` and 2 variants
 */
interface AccentPalette extends BasePalette {
  darker: Color
  lighter: Color
  medium?: Color
}

interface TradingAccentPalette extends BasePalette {
  lighter: Color
}

export type AccentName = "primary" | "positive" | "aware" | "negative"
/**
 * A set of theme-agnostic palettes
 */
export type AccentPaletteMap = { [accent in AccentName]: AccentPalette }

const accents: AccentPaletteMap = {
  primary: {
    base: rgb(95, 148, 245),
    darker: rgb(76, 118, 196),
    lighter: rgb(127, 169, 247),
  },
  positive: {
    base: rgb(1, 195, 141),
    darker: rgb(3, 160, 119),
    lighter: rgb(12, 150, 116),
    medium: rgb(153, 231, 209),
  },
  aware: {
    base: rgb(255, 141, 0),
    darker: rgb(229, 126, 0),
    lighter: rgb(255, 232, 204),
    medium: rgb(255, 197, 127),
  },
  negative: {
    base: rgb(255, 39, 75),
    darker: rgb(230, 35, 67),
    lighter: rgb(255, 211, 219),
    medium: rgb(255, 146, 164),
  },
}

export type TradingPaletteMap = {
  [direction in Direction]: TradingAccentPalette
}
const uniqueCollections: TradingPaletteMap = {
  [Direction.Sell]: {
    base: rgb(255, 39, 75),
    lighter: rgb(255, 211, 219),
  },
  [Direction.Buy]: {
    base: rgb(45, 149, 255),
    lighter: rgb(191, 222, 255),
  },
}

const spectrum = {
  offblack,
  brand,
  red,
  green,
  yellow,
  blue,
  uniqueCollections,
}

export const colors = {
  static: { white: WHITE, black: BLACK, transparent: TRANSPARENT },
  spectrum,
  accents,
  light,
  dark,
}

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////   🐲   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

type CreatePaletteParams = {
  whitePoint?: Color
  blackPoint?: Color
} & Partial<PaletteShadeSet>
function createPalette(
  base: Color,
  {
    whitePoint = WHITE,
    blackPoint = BLACK,
    ...shadeOverrides
  }: CreatePaletteParams = {},
): ColorPalette {
  return {
    // Light shades
    L95: mix(0.95, whitePoint, base),
    L9: mix(9 / 10, whitePoint, base),
    L8: mix(8 / 10, whitePoint, base),
    L7: mix(7 / 10, whitePoint, base),
    L6: mix(6 / 10, whitePoint, base),
    L5: mix(5 / 10, whitePoint, base),
    L4: mix(4 / 10, whitePoint, base),
    L3: mix(3 / 10, whitePoint, base),
    L2: mix(2 / 10, whitePoint, base),
    L1: mix(1 / 10, whitePoint, base),

    base,

    // Dark shades
    D1: mix(1 / 10, blackPoint, base),
    D2: mix(2 / 10, blackPoint, base),
    D3: mix(3 / 10, blackPoint, base),
    D4: mix(4 / 10, blackPoint, base),
    D5: mix(5 / 10, blackPoint, base),
    D6: mix(6 / 10, blackPoint, base),
    D7: mix(7 / 10, blackPoint, base),
    D8: mix(8 / 10, blackPoint, base),
    D9: mix(9 / 10, blackPoint, base),
    D95: mix(0.95, blackPoint, base),

    // Overriding Computed Values
    //
    // Computed values may not be the same as those intended by
    // the designer.
    //
    // Mixing colors is a transformation within a color space.
    // Tools like Sketch or Photoshop implement non-linear
    // transformations between two values.
    //
    // So, the result of
    //    mix(0.5, rgb(255, 0, 0), rgb(0, 0, 255))
    //      != rgb(127, 0, 127)
    // it would be
    //    rgb(141, 0, 132) in sRGB
    //    rgb(128, 0, 128) in P3
    //
    // Or, the result of
    //    mix(0.5, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 0.5))
    //      != rgb(127, 0, 127, 1)
    //
    //    rgb(207, 47, 97) in sRGB
    //    rgb(190, 62, 98) in P3
    //
    // Because of the various ways colors may show up on different
    // displays we typically show a preference for a smaller
    // color space such as sRGB.
    //
    // So we may have to override specific values to achieve a
    // consistent color and color contrast ratio across the shades.
    ...shadeOverrides,
  }
}
