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
 * Until Emotion 10, we need to block Emotion from using speedy mode.
 * This allows us to use a MutationObserver in our portals to watch
 * for changes in style tags.
 */

sheet.speedy(false)
