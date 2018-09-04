
 const unzip = require('unzip');

const https = require('https')
const fs = require('fs')
const fstream = require('fstream')

const createinstaller = enviroment => {
  const fileName = `ReactiveTraderCloud-${enviroment}`
  const appJSONUrl = `https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/master/src/client/public/config/openfin/${enviroment}.app.json`

  const file = fs.createWriteStream(`src/install/ReactiveTraderCloud-${enviroment}.zip`)
  const request = https.get(
    `https://install.openfin.co/download/?config=${appJSONUrl}&fileName=${fileName}`,
    response =>
      response.pipe(file).on('finish', () => {
        var readStream = fs.createReadStream(`src/install/ReactiveTraderCloud-${enviroment}.zip`),
        writeStream = fstream.Writer('src/install/');
        readStream.pipe(unzip.Parse())
        .pipe(writeStream)
      
        writeStream.on('close', () => {
          fs.unlink(`src/install/ReactiveTraderCloud-${enviroment}.zip`)
        });
      })
  )
}

createinstaller('demo')
createinstaller('dev')
