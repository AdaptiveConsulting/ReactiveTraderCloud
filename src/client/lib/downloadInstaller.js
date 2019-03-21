const https = require('https')
const fs = require('fs')
const childProcess = require('child_process')

const getCurrentGitBranchName = () =>
  new Promise(resolve => {
    childProcess.exec(`git rev-parse --abbrev-ref HEAD`, (err, stdout, stderr) => {
      resolve((stdout || '').trimRight())
    })
  })

const createInstaller = (branch, enviroment) => {
  const fileName = `ReactiveTraderCloud-${enviroment}`
  const appJSONUrl = `https://raw.githubusercontent.com/AdaptiveConsulting/ReactiveTraderCloud/${branch}/src/client/public/config/openfin/${enviroment}.json`
  const installerGeneratorUrl = `https://install.openfin.co/download/?unzipped=true&config=${appJSONUrl}&fileName=${fileName}`

  console.log(` - Generating installer: ${fileName}.exe`)

  return new Promise(resolve => {
    https.get(installerGeneratorUrl, response => {
      const file = fs.createWriteStream(`install/${fileName}.exe`)
      response.pipe(file)
      resolve()
    })
  })
}

const createInstallers = (branch, environments) => {
  console.log(`Generating installers for manifests in branch: \x1b[36m${branch}\x1b[0m`)
  console.log(
    '\x1b[33m%s\x1b[0m', // Yellow
    `
NOTE: The manifests used to create the installers must already be pushed to GitHub!
This process won't error if they are not available there, so please make sure they are, 
otherwise the executable installer .exe files will error at runtime.
`,
  )

  return environments.reduce(
    (sequence, env) => sequence.then(() => createInstaller(branch, env)),
    Promise.resolve(),
  )
}

// TODO: These could be exposed as arguments for greater flexibility
const DEFAULT_BRANCH = 'develop'
const INSTALLERS_TO_CREATE = ['demo', 'dev', 'launcher-demo', 'launcher-dev']

getCurrentGitBranchName().then(branch =>
  createInstallers(branch || DEFAULT_BRANCH, INSTALLERS_TO_CREATE),
)
