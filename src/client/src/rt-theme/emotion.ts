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
  caches
} = createEmotion({})

/**
 * Force emotion to run in "production" mode
 * This is temporary until Emotion 10
 */

sheet.speedy(false)
