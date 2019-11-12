const https = require('https')
const fs = require('fs')

const createInstaller = (tag, manifestName, os='win') => {
  const fileName = `ReactiveTraderCloud-${manifestName}`
  const appJSONUrl = `https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/${tag}/src/client/public/config/openfin/${manifestName}.json`
  const installerGeneratorUrl = `https://install.openfin.co/download/?unzipped=true&config=${appJSONUrl}&fileName=${fileName}&os=${os}`
  console.log(` - Generating installer: \x1b[36m${fileName}.exe\x1b[0m (points to \x1b[36m${tag}\x1b[0m tag)`)

  return new Promise((resolve, reject) => {
    https.get(installerGeneratorUrl, response => {
      if(response.statusCode === 200) {
        const extension = os === 'win' ? 'exe' : 'dmg'
        const file = fs.createWriteStream(`install/${fileName}.${extension}`)
        response.pipe(file)
        console.info(` - \x1b[32mSuccessfully created installer for ${tag} ${manifestName} ${os}\x1b[0m`)
        resolve()
      }
      else {
        console.error(` - \x1b[31mFailed to create installer for ${tag} ${manifestName} ${os}\x1b[0m`)
        reject()
      }
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

  const installerDownloads = installersData.map(({ tag, manifestName })=> {
    const winInstaller = createInstaller(tag, manifestName)
    const osxInstaller = createInstaller(tag, manifestName, 'osx') 
    return Promise.all([winInstaller, osxInstaller])
  });

  return Promise.all(installerDownloads).catch(ex => {
    process.exit(1);
  })
}

// File name + github branch for each json manifest
const INSTALLERS_TO_CREATE = [
  { manifestName: 'dev', tag: 'env-dev' },
  { manifestName: 'launcher-dev', tag: 'env-dev' },
  { manifestName: 'demo', tag: 'env-demo' },
  { manifestName: 'launcher-demo', tag: 'env-demo' },
]

createInstallers(INSTALLERS_TO_CREATE)

