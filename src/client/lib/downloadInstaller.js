const https = require('https')
const fs = require('fs')

const createInstaller = (branch, enviroment) => {
  const fileName = `ReactiveTraderCloud-${enviroment}`
  const appJSONUrl = `https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/${branch}/src/client/public/config/openfin/${enviroment}.json`
  const installerGeneratorUrl = `https://install.openfin.co/download/?unzipped=true&config=${appJSONUrl}&fileName=${fileName}`

  console.log(`Generating installer: ${fileName}.exe`)

  return new Promise(resolve => {
    https.get(installerGeneratorUrl, response => {
      const file = fs.createWriteStream(`install/${fileName}.exe`)
      response.pipe(file)
      resolve()
    })
  })
}

const createInstallers = (branch, environments) =>
  environments.reduce(
    (sequence, env) => sequence.then(() => createInstaller(branch, env)),
    Promise.resolve(),
  )

// TODO: These could be exposed as arguments for greater flexibility
const BRANCH = 'master'
const INSTALLERS_TO_CREATE = ['demo', 'dev', 'launcher-demo', 'launcher-dev']

createInstallers(BRANCH, INSTALLERS_TO_CREATE)
