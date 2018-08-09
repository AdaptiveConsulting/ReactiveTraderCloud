require('@babel/polyfill')
require('@babel/register')({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  // ignore: []
})

module.exports = require('./addEmotionToBabel')
