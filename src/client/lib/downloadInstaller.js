const https = require('https')
const getJSON = require('get-json')
const fs = require('fs')

const getInstallerGeneratorUrl = async (fileName, appJSONUrl, os) => {
  const installerGeneratorUrl = `https://install.openfin.co/download/?config=${appJSONUrl}&fileName=${fileName}&os=${os}`;

  if (os === 'osx') {
    const appJSON = await getJSON(appJSONUrl.replace('https','http'))
    const appName = appJSON.startup_app ? appJSON.startup_app.name : appJSON.shortcut.name
    const iconFile = appJSON.startup_app ? appJSON.startup_app.name : appJSON.snapshot.windows[0].applicationIcon
    return `${installerGeneratorUrl}&internal=true&appName=${appName}&iconFile=${iconFile}`
  }

  return `${installerGeneratorUrl}&unzipped=true`
}

const getFileSuffix = (type, env) => {
  if (type === 'launcher') return `-launcher-${env}`;
  if (type === 'platform') return '-platform';
  return `-${env}`;
}

const createInstaller = async (type, env, os = 'win') => {
  const fileName = `ReactiveTraderCloud${getFileSuffix(type, env)}`
  const appJSONUrl = `https://web-${env}.adaptivecluster.com/openfin/${type}.json`
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

  installersData.reduce(async (prev, { type, env, os }) => {
    await prev;
    return createInstaller(type, env, os);
  }, Promise.resolve())
}

const INSTALLERS_TO_CREATE = [
  // win
  { type: 'app', env: 'dev', os: 'win' },
  { type: 'app', env: 'uat', os: 'win' },
  { type: 'app', env: 'demo', os: 'win' },
  { type: 'launcher', env: 'dev', os: 'win' },
  { type: 'launcher', env: 'uat', os: 'win' },
  { type: 'launcher', env: 'demo', os: 'win' },
  { type: 'platform', env: 'openfin', os: 'win' },

  // os-x
  { type: 'app', env: 'uat', os: 'osx' },
  { type: 'app', env: 'dev', os: 'osx' },
  { type: 'app', env: 'demo', os: 'osx' },
  { type: 'launcher', env: 'demo', os: 'osx' },
  { type: 'launcher', env: 'dev', os: 'osx' },
  { type: 'launcher', env: 'uat', os: 'osx' },
  { type: 'platform', env: 'openfin', os: 'osx' },
]

createInstallers(INSTALLERS_TO_CREATE)

