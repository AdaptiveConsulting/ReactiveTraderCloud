import { mix, rgb, rgba } from 'polished'

export interface Palette {
  base: string
  [shade: string]: string
}

export interface PaletteMap {
  [palette: string]: Palette
}

export type ColorPalette = Palette & {
  L10: string
  L95: string
  L9: string
  L8: string
  L7: string
  L6: string
  L5: string
  L4: string
  L3: string
  L2: string
  L1: string
  D1: string
  D2: string
  D3: string
  D4: string
  D5: string
  D6: string
  D7: string
  D8: string
  D9: string
  D10: string
}

export interface ColorMap {
  [colorGroup: string]: PaletteMap
}

// Some designs will redefine white to achieve different
// visual effects on the viewers eyes.
export const white: Palette = {
  base: rgb(255, 255, 255)
}

// The same is true for black -- because we do not encounter
// true black or true white in natural conditions designs
// employing them in their primary palettes will be
// less appealing to most people.
export const black: Palette = {
  base: rgb(0, 0, 0)
}

// The meaning of transparent varies based on platform.
//
// Unlike most browsers Apple defines transparent as
//  rgba(0, 0, 0, 0) instead of rgba(255, 255, 255, 0)
//
// You will see this if you transition from or to
// transparency in a gradient or animation.
export const transparent: Palette = {
  base: rgba(255, 255, 255, 0)
}

// For this reasons designers will choose an
// offwhite and offblack color to set the
// range on their designs.
//
// They may reserve the use of true white to
// contrast with offwhite and draw attention
// to an input or button. Or a subtle boundary
// between elements.
export const offwhite = createPalette({
  base: rgb(244, 246, 249)
})

// We use a base color to generate a complement
// of shades above and below at 10% increments.
export const offblack = createPalette({
  base: rgb(85, 93, 112),
  // We can provide additional shades or override
  // the generated shades.
  L25: mix(0.25, white.base, rgb(85, 93, 112)),
  // We are overriding the value for D4 due to
  // insuffcient contrast ratio and inconsistency
  // with the designers intent.
  D4: rgb(39, 45, 58)
})

export const brand = createPalette({
  base: rgb(42, 87, 141)
})

export const blue = createPalette({
  base: rgb(81, 147, 253)
})

export const red = createPalette({
  base: rgb(255, 53, 66)
})

export const yellow = createPalette({
  base: rgb(255, 184, 40),
  // We are overriding the value for L1 due to
  // insuffcient contrast and inconsistency
  // with the designers intent.
  L1: rgb(241, 193, 109)
})

export const green = createPalette({
  base: rgb(0, 205, 130)
})

export const light: PaletteMap = {
  primary: {
    base: blue.L10,
    1: blue.L95,
    2: blue.L9,
    3: blue.L8,
    4: blue.L7
  },
  secondary: {
    base: offblack.base,
    1: offblack.L1,
    2: mix(0.25, white.base, offblack.base),
    3: offblack.D4,
    4: offblack.L5
  }
}

export const dark: PaletteMap = {
  primary: {
    base: offblack.D3,
    1: offblack.D4,
    2: offblack.base,
    3: offblack.D1,
    4: offblack.D7
  },
  secondary: {
    base: blue.L10,
    1: blue.L95,
    2: blue.L9,
    3: blue.L8,
    4: blue.L5
  }
}

export const accents: PaletteMap = {
  accent: {
    base: blue.base,
    1: blue.D2,
    2: blue.L5
  },
  good: {
    base: green.base,
    1: green.D1,
    2: green.L5
  },
  aware: {
    base: yellow.base,
    1: yellow.D1,
    2: yellow.L5
  },
  bad: {
    base: red.base,
    1: red.D1,
    2: red.L5
  }
}

const spectrum: PaletteMap = {
  transparent,
  white,
  black,
  offwhite,
  brand,
  offblack,
  red,
  green,
  yellow,
  blue
}

export const colors: { [colorGroup: string]: PaletteMap } = {
  spectrum,
  accents,
  light,
  dark
}

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////   🐲   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function createPalette({
  base,
  white: whitePoint = white.base,
  black: blackPoint = black.base,
  ...overrides
}: Palette): ColorPalette {
  return {
    // Light shades
    L10: mix(1, whitePoint, base),
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
    D10: mix(10 / 10, blackPoint, base),

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
    ...overrides
  }
}
