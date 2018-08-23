import createEmotion from 'create-emotion'

const plugin = (context, content, selectors, parent, line, column, length) => {
  // Context is -2 for post processed context, before the compiled css output is returned
  if (context === -2) {
    console.log('%c POST-PROCESS ', 'background: #222; color: #bada55')
  }
}

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
} = createEmotion(
  {},
  {
    stylisPlugins: [plugin]
  }
)

//Force emotion to run in "production" mode
sheet.speedy(true)
