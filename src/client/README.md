# Reactive Trader Cloud - UI

## Machine Setup
Please ensure you have [Node](https://nodejs.org) and [Git](https://git-scm.com/downloads) installed on your machine and on your path.

### Mac
You're good to go.

NB: The default version of Node installed on Mac OS X is not recent enough, and you need to specifically install a new version.

### Linux
You might want to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### Windows

1. Install [Python 2.7](https://www.python.org/downloads/). Browser-sync (and various other Node modules) rely on node-gyp, which requires Python on Windows
2. Install the C++ Compiler. [Visual Studio Express](https://www.visualstudio.com/en-US/products/visual-studio-express-vs) comes bundled with a free C++ compiler. Or, if you already have Visual Studio installed: Open Visual Studio and go to File -> New -> Project -> Visual C++ -> Install Visual C++ Tools for Windows Desktop. The C++ compiler is used to compile browser-sync (and perhaps other Node modules).

## Starting the GUI

Clone the repo and install the necessary node modules:

```sh
npm i                         # Install Node modules listed in ./package.json (may take a while the first time)
npm start                     # Compile and launchs the webpack dev server
```

You can then browse the app at http://localhost:3000

### Additional command line options

```sh
npm run dev
```

Same as `npm run start`, runs the webpack build system with webpack-dev-server (by default found at [localhost:3000](http://]localhost:3000).

```sh
npm run test
```
Runs unit tests with Karma and Jasmine.

```sh
npm run test:dev
```
Similar to `npm run test`, but will watch for changes and re-run tests.

```sh
npm run lint
```
Run ESLint against all `.js` files in `~/src`.
Note the linter also runs by default during normal dev watch build (`npm run dev`).

```sh
npm run deploy
```
Run webpack using the webpack config.

### Starting the GUI in [OpenFin](https://openfin.co/)
Currently, this is only available for Windows clients but likely will change Q1 of 2016 when the OpenFin runtime moves to Electron.

To run the app in OpenFin, you need to:

```sh
npm i -g openfin-cli
openfin -l -c src/app.json
```

Now also supported as a built-in npm task:

```sh
npm run openfin
```

By default, OpenFin will connect to your local development server on port 3000 (`http://localhost:3000/`) but you can override that by passing an extra argument to the launcher:

```sh
openfin -l -c src/app.json -u http://somedomain.com
```

Once this completes and resources are fetched, OpenFin will create an app icon on your desktop with the last configuration setting that you can relaunch.
