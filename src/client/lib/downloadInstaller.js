const https = require('https')
const fs = require('fs')

const fileName = 'ReactiveTraderInstaller'
const appJSONUrl = 'https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/feature/refactor/src/client/config/openfin/2084.app.json'

const file = fs.createWriteStream('install/ReactiveTraderCloud-demo.zip')
const request = https.get(`https://dl.openfin.co/services/download?fileName=${fileName}&config=${appJSONUrl}`, function(response) {
  response.pipe(file)
})
