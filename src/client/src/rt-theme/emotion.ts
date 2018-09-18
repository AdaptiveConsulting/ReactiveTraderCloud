import createEmotion from 'create-emotion'

export const {
  flush,
  hydrate,
  cx,
  merge,
  getRegisteredStyles,
  injectGlobal,
  keyframes,
  css,
  sheet,
  caches,
} = createEmotion({})

//Enable speedy mode for improved dev performance
// sheet.speedy(true)
