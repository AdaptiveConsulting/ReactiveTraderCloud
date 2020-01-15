const https = require('https')
const getJSON = require('get-json')
const fs = require('fs')

const getInstallerGeneratorUrl = async (fileName, appJSONUrl, os) => {
  const installerGeneratorUrl = `https://install.openfin.co/download/?config=${appJSONUrl}&fileName=${fileName}&os=${os}`;

  if (os === 'osx') {
    const appJSON = await getJSON(appJSONUrl)
    const appName = appJSON.startup_app.name
    const iconFile = appJSON.startup_app.applicationIcon
    return `${installerGeneratorUrl}&internal=true&appName=${appName}&iconFile=${iconFile}`
  }

  return `${installerGeneratorUrl}&unzipped=true`
}

const createInstaller = async (type, env, os = 'win') => {
  // maintain previous filenames for installers TODO: is this a requirement?
  const isLauncher = type === 'launcher'
  const fileName = `ReactiveTraderCloud${isLauncher ? '-launcher' : ''}-${env}`

  const appJSONUrl = `https://web-dev.adaptivecluster.com:8080?type=${type}&env=${env}`
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
`,
  )

  const installerDownloads = installersData.map(({ type, env, os })=> {
    return createInstaller(type, env, os)
  });

  return Promise.all(installerDownloads)
}

const INSTALLERS_TO_CREATE = [
  { type: 'app', env: 'dev', os: 'win' },
  { type: 'app', env: 'dev', os: 'osx' },
  { type: 'app', env: 'uat', os: 'win' },
  { type: 'app', env: 'uat', os: 'osx' },
  { type: 'app', env: 'demo', os: 'win' },
  { type: 'app', env: 'demo', os: 'osx' },
  { type: 'launcher', env: 'dev', os: 'win' },
  { type: 'launcher', env: 'uat', os: 'win' },
  { type: 'launcher', env: 'demo', os: 'win' }
]

createInstallers(INSTALLERS_TO_CREATE)

