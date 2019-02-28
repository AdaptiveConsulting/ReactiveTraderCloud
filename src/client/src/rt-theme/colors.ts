import { mix, rgb, rgba } from 'polished'

/**
 * Colors, the things you see, or don't if you're color blind!
 *
 * @example #123456, rgba(0, 0, 0, 0.5), salmon, or royalblue
 */
export type Color = string

interface BasePalette {
  base: Color
}

interface LightShadeSet {
  L95: Color
  L9: Color
  L8: Color
  L7: Color
  L6: Color
  L5: Color
  L4: Color
  L3: Color
  L2: Color
  L1: Color
}

interface DarkShadeSet {
  D1: Color
  D2: Color
  D3: Color
  D4: Color
  D5: Color
  D6: Color
  D7: Color
  D8: Color
  D9: Color
  D95: Color
}

type PaletteShadeSet = LightShadeSet & DarkShadeSet

/**
 * A palette formed by a `base` color plus:
 * - a number of darker (D1..D10) shades
 * - a number of lighter (L1..L95) shades
 */
export type ColorPalette = BasePalette & PaletteShadeSet

/**
 * A palette consisting of a `base` and 4 variants
 */
export interface CorePalette extends BasePalette {
  1: Color
  2: Color
  3: Color
  4: Color
}

/**
 * A theme palette consisting of a `base` and 2 variants
 */
interface AccentPalette extends BasePalette {
  darker: Color
  lighter: Color
}

interface Colors {
  [key: string]: string
}

export interface CorePaletteMap {
  primary: Colors
  secondary: Colors
  core: Colors
}

/**
 * A set of theme-agnostic palettes
 */
export interface AccentPaletteMap {
  primary: AccentPalette
  aware: AccentPalette
  bad: AccentPalette
  good: AccentPalette
}
export type AccentName = keyof AccentPaletteMap

// Some designs will redefine white to achieve different
// visual effects on the viewers eyes.
const white: Color = rgb(255, 255, 255)

// The same is true for black -- because we do not encounter
// true black or true white in natural conditions designs
// employing them in their primary palettes will be
// less appealing to most people.
const black: Color = rgb(0, 0, 0)
// The meaning of transparent varies based on platform.
//
// Unlike most browsers Apple defines transparent as
//  rgba(0, 0, 0, 0) instead of rgba(255, 255, 255, 0)
//
// You will see this if you transition from or to
// transparency in a gradient or animation.
const transparent: Color = rgba(255, 255, 255, 0)

// For this reasons designers will choose an
// offwhite and offblack color to set the
// range on their designs.
//
// They may reserve the use of true white to
// contrast with offwhite and draw attention
// to an input or button. Or a subtle boundary
// between elements.
const offwhite = createPalette(rgb(244, 246, 249))

// We use a base color to generate a complement
// of shades above and below at 10% increments.
const offblack = createPalette(
  rgb(68, 76, 95), // sRGB
  {
    // We can provide additional shades or override
    // the generated shades.
    L3: mix(0.25, white, rgb(85, 93, 112)),
    // We are overriding these values due to
    // insuffcient contrast ratio and inconsistency
    // with the designers intent.
    D3: rgb(46, 53, 67),
    D4: rgb(39, 45, 58),
  },
)
const blue = createPalette(rgb(81, 147, 253), { L95: rgb(244, 246, 249) })

const red = createPalette(rgb(255, 53, 66))

const yellow = createPalette(
  rgb(255, 184, 40),
  // We are overriding the value for L1 due to
  // insuffcient contrast and inconsistency
  // with the designers intent.
  { L1: rgb(241, 193, 109) },
)

const green = createPalette(rgb(0, 205, 130))

const brand = createPalette(
  rgb(42, 87, 141), // Adaptive blue a.k.a. #2A578D
)

export const light: CorePaletteMap = {
  primary: {
    base: white,
    1: blue.L95,
    2: blue.L9,
    3: blue.L8,
    4: blue.L7,
  },
  secondary: {
    base: offblack.base,
    1: offblack.L1,
    2: offblack.L3,
    3: offblack.D4,
    4: offblack.L5,
  },
  core: {
    lightBackground: '#ffffff',
    darkBackground: 'rgb(244, 246, 249)',
    alternateBackground: 'rgb(220, 233, 254)',
    offBackground: '#edf4fe',
    textColor: '#333333',
    backgroundHoverColor: '#ffffff',
  },
}

export const dark: CorePaletteMap = {
  primary: {
    base: offblack.D3,
    1: offblack.D4,
    2: offblack.base,
    3: offblack.D1,
    4: offblack.D7,
  },
  secondary: {
    base: white,
    1: blue.L95,
    2: blue.L9,
    3: blue.L8,
    4: blue.L5,
  },
  core: {
    lightBackground: offblack.D3,
    darkBackground: offblack.D4,
    alternateBackground: 'rgb(61, 68, 85)',
    offBackground: '#444c5f',
    textColor: white,
    backgroundHoverColor: '#3d4455',
  },
}

const accents: AccentPaletteMap = {
  primary: {
    base: blue.base,
    darker: blue.D2,
    lighter: blue.L5,
  },
  good: {
    base: green.base,
    darker: green.D1,
    lighter: green.L5,
  },
  aware: {
    base: yellow.base,
    darker: yellow.D1,
    lighter: yellow.L5,
  },
  bad: {
    base: red.base,
    darker: red.D1,
    lighter: red.L5,
  },
}

const spectrum = {
  offwhite,
  offblack,
  brand,
  red,
  green,
  yellow,
  blue,
}

export const colors = {
  static: { white, black, transparent },
  spectrum,
  accents,
  light,
  dark,
}

export default colors

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////   🐲   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

type CreatePaletteParams = {
  whitePoint?: Color
  blackPoint?: Color
} & Partial<PaletteShadeSet>
function createPalette(
  base: Color,
  { whitePoint = white, blackPoint = black, ...shadeOverrides }: CreatePaletteParams = {},
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
