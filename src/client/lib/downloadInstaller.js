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

const createInstaller = async (branch, manifestName, os = 'win') => {
  const fileName = `ReactiveTraderCloud-${manifestName}`
  const appJSONUrl = `https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/${branch}/src/client/public/config/openfin/${manifestName}.json`
  const installerGeneratorUrl = await getInstallerGeneratorUrl(fileName, appJSONUrl, os)
  const extension = os === 'win' ? 'exe' : 'dmg'
  
  console.log(` - Generating installer: \x1b[36m${fileName}.${extension}\x1b[0m (points to \x1b[36m${branch}\x1b[0m branch)`)

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

  const installerDownloads = installersData.map(({ branch, manifestName, os })=> {
    return createInstaller(branch, manifestName, os)
  });

  return Promise.all(installerDownloads)
}

// File name + github branch for each json manifest
const INSTALLERS_TO_CREATE = [
  { manifestName: 'dev', branch: 'master', os: 'win' },
  { manifestName: 'dev', branch: 'master', os: 'osx' },
  { manifestName: 'uat', branch: 'master', os: 'win' },
  { manifestName: 'uat', branch: 'master', os: 'osx' },
  { manifestName: 'demo', branch: 'master', os: 'win' },
  { manifestName: 'demo', branch: 'master', os: 'osx' },
  { manifestName: 'launcher-dev', branch: 'master', os: 'win' },
  { manifestName: 'launcher-uat', branch: 'master', os: 'win' },
  { manifestName: 'launcher-demo', branch: 'master', os: 'win' }
]

createInstallers(INSTALLERS_TO_CREATE)

