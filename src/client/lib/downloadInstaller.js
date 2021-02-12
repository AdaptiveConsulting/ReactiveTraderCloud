const https = require('https')
const getJSON = require('get-json')
const fs = require('fs')

const getInstallerGeneratorUrl = async (fileName, appJSONUrl, os) => {
  const installerGeneratorUrl = `https://install.openfin.co/download/?config=${appJSONUrl}&os=${os}`

  if (os === 'osx') {
    const appJSON = await getJSON(appJSONUrl)
    const appName = appJSON.platform ? appJSON.platform.name : appJSON.startup_app.name
    const iconFile = appJSON.platform
      ? appJSON.platform.applicationIcon
      : appJSON.startup_app.applicationIcon
    return `${installerGeneratorUrl}&internal=true&appName=${appName}&iconFile=${iconFile}`
  }

  return `${installerGeneratorUrl}&unzipped=true`
}

const getFileName = (type, env) => {
  if (type === 'launcher') return `Reactive-Launcher-${env}`
  return `Reactive-Trader-${env}`
}

const createInstaller = async (type, env, os = 'win') => {
  const fileName = getFileName(type, env)
  const appJSONUrl = env === 'demo'
    ? `https://www.reactivetrader.com/openfin/${type}.json`
    : `https://${env.toLowerCase()}.reactivetrader.com/openfin/${type}.json`
  const installerGeneratorUrl = await getInstallerGeneratorUrl(fileName, appJSONUrl, os)
  const extension = os === 'win' ? 'exe' : 'dmg'

  console.log(` - Generating installer: \x1b[36m${fileName}.${extension}\x1b[0m`)

  return new Promise(resolve => {
    https.get(installerGeneratorUrl, response => {
      const file = fs.createWriteStream(`install/${fileName}.${extension}`)
      response.pipe(file)
      resolve()
    })
  })
}

const createInstallers = installersData => {
  console.log(`Generating installers`)
  console.log(
    '\x1b[33m%s\x1b[0m', // Yellow
    `
NOTE: The installers contain just the URL to the manifest, not a copy of the manifest itself.
Make sure the files are available on their respective locations when distributing the installer.
`
  )

  installersData.reduce(async (prev, { type, env, os }) => {
    await prev
    return createInstaller(type, env, os)
  }, Promise.resolve())
}

const INSTALLERS_TO_CREATE = [
  // win
  { type: 'app', env: 'Dev', os: 'win' },
  { type: 'app', env: 'UAT', os: 'win' },
  { type: 'app', env: 'Demo', os: 'win' },
  { type: 'launcher', env: 'Dev', os: 'win' },
  { type: 'launcher', env: 'UAT', os: 'win' },
  { type: 'launcher', env: 'Demo', os: 'win' },
  // os-x
  { type: 'app', env: 'Dev', os: 'osx' },
  { type: 'app', env: 'UAT', os: 'osx' },
  { type: 'app', env: 'Demo', os: 'osx' },
  { type: 'launcher', env: 'Dev', os: 'osx' },
  { type: 'launcher', env: 'UAT', os: 'osx' },
  { type: 'launcher', env: 'Demo', os: 'osx' },
]

createInstallers(INSTALLERS_TO_CREATE)
