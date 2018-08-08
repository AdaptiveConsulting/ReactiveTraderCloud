import _ from 'lodash';
import { mix, rgb, rgba } from 'polished';

const [WHITE, BLACK, TRANSPARENT] = [
  rgb(255, 255, 255),
  rgb(0, 0, 0),
  rgba(255, 255, 255, 0),
];

export const white = {
  base: WHITE,
};

export const black = {
  base: BLACK,
};

export const transparent = {
  base: TRANSPARENT,
};

export const offwhite = createPalette({
  base: rgb(244, 246, 249),
});

export const offblack = createPalette({
  base: rgb(85, 93, 112),
  // provide custom and one-off values within a palette
  // L25: mix(0.25, WHITE, rgb(85, 93, 112)),
});

export const brand = createPalette({
  base: rgb(42, 87, 141),
});

export const blue = createPalette({
  base: rgb(81, 147, 253),
});

export const red = createPalette({
  base: rgb(255, 53, 66),
});

export const yellow = createPalette({
  base: rgb(255, 184, 40),
  // manually correcet for poorly mixed values
  // L1: rgb(241, 193, 109),
});

export const green = createPalette({
  base: rgb(0, 205, 130),
});

export const light = {
  primary: {
    base: blue.L10,
    1: blue.L95,
    2: blue.L9,
    3: blue.L8,
    4: blue.L7,
  },
  secondary: {
    base: offblack.base,
    1: offblack.L1,
    2: mix(0.25, WHITE, offblack.base),
    3: offblack.D4,
    4: offblack.L5,
  },
};

export const dark = {
  primary: {
    base: offblack.D3,
    1: offblack.D1,
    2: offblack.base,
    3: offblack.D1,
    4: offblack.D7,
  },
  secondary: {
    base: blue.L10,
    1: blue.L95,
    2: blue.L9,
    3: blue.L8,
    4: blue.L5,
  },
};

export const accents = {
  accent: {
    base: blue.base,
    1: blue.D2,
    2: blue.L5,
  },
  good: {
    base: green.base,
    1: green.D1,
    2: green.L5,
  },
  aware: {
    base: yellow.base,
    1: yellow.D1,
    2: yellow.L5,
  },
  bad: {
    base: red.base,
    1: red.D1,
    2: red.L5,
  },
};

export const unique = {
  tradingSell: red.base,
  tradingBuy: blue.base,
};

export const palettes = {
  spectrum: {
    transparent,
    white,
    black,
    offwhite,
    brand,
    offblack,
    red,
    green,
    yellow,
    blue,
  },
  accents,
  light,
  dark,
};

export const colors = flatten({
  ...palettes.spectrum,
  ...palettes.accents,
  light: flatten(light),
  dark: flatten(dark),
});

////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////   🐲   ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function flatten(colorSets) {
  return _.reduce(
    colorSets,
    function(acc, set, name) {
      _.forEach(set, (value, level) => {
        acc[_.camelCase(`${name}_${level}`)] = value;

        // add `color` for `100`
        if (level === '100' || level === 'base') {
          acc[name] = value;
        }
      });

      return acc;
    },
    {}
  );
}

function createPalette({
  base,
  white = WHITE,
  black = BLACK,
  transparent = TRANSPARENT,
  ...overrides
}) {
  return {
    base,

    L95: mix(0.95, white, base),

    // only relevant offblack … move to override?
    // L25: mix(0.25, white, base),

    // lights
    ..._.range(10, 0).reduce((acc, degree) => {
      acc[`L${degree}`] = mix(degree / 10, white, base);

      return acc;
    }, {}),

    // darks
    ..._.range(10, 0).reduce((acc, degree) => {
      acc[`D${degree}`] = mix(degree / 10, black, base);

      return acc;
    }, {}),

    // transparents
    // ..._.range(9, 0).reduce((acc, degree) => {
    //   acc[`A${degree}`] = mix(degree / 10, transparent, base);
    //
    //   return acc;
    // }, {}),

    // … overrides?
    ...overrides,
  };
}
