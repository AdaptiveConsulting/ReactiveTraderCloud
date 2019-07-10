const https = require('https')
const fs = require('fs')

// const childProcess = require('child_process')

// const getCurrentGitBranchName = () =>
//   new Promise(resolve => {
//     childProcess.exec(`git rev-parse --abbrev-ref HEAD`, (err, stdout, stderr) => {
//       resolve((stdout || '').trimRight())
//     })
//   })

const createInstaller = (branch, manifestName, os='win') => {
  const fileName = `ReactiveTraderCloud-${manifestName}`
  const appJSONUrl = `https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/${branch}/src/client/public/config/openfin/${manifestName}.json`
  const installerGeneratorUrl = `https://install.openfin.co/download/?unzipped=true&config=${appJSONUrl}&fileName=${fileName}&os=${os}`

  console.log(` - Generating installer: \x1b[36m${fileName}.exe\x1b[0m (points to \x1b[36m${branch}\x1b[0m branch)`)

  return new Promise(resolve => {
    https.get(installerGeneratorUrl, response => {
      const extension = os === 'win' ? 'exe' : 'dmg'
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

  const installerDownloads = installersData.map(({ branch, manifestName })=> {
    const winInstaller = createInstaller(branch, manifestName)
    const osxInstaller = createInstaller(branch, manifestName, 'osx') 
    return Promise.all([winInstaller, osxInstaller])
  });

  return Promise.all(installerDownloads)
}

// File name + github branch for each json manifest
const INSTALLERS_TO_CREATE = [
  { manifestName: 'dev', branch: 'develop' },
  { manifestName: 'launcher-dev', branch: 'develop' },
  { manifestName: 'demo', branch: 'master' },
  { manifestName: 'launcher-demo', branch: 'master' },
]

createInstallers(INSTALLERS_TO_CREATE)

