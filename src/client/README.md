## Reactive Trader Cloud - UI

### Requirements

#### Initial Machine Setup
1. Install [Node](https://nodejs.org)
2. Install [Git](https://git-scm.com/downloads)
3. On a Mac? You're all set. If you're on Linux or Windows, complete the steps for your OS below

**On Linux:**
Run this to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).
```echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p```

**On Windows:**

1. Install [Python 2.7](https://www.python.org/downloads/). Browser-sync (and various other Node modules) rely on node-gyp, which requires Python on Windows
2. Install the C++ Compiler. [Visual Studio Express](https://www.visualstudio.com/en-US/products/visual-studio-express-vs) comes bundled with a free C++ compiler. Or, if you already have Visual Studio installed: Open Visual Studio and go to File -> New -> Project -> Visual C++ -> Install Visual C++ Tools for Windows Desktop. The C++ compiler is used to compile browser-sync (and perhaps other Node modules).

#### Versions

Tested at time of writing with:

- nodejs `^5.4.0` (on older versions you need o pass `--harmony` flag to a lot of the build/dev scripts)
- npm `^3.3.12`

> *NB* Although we have adopted _exact_ versioning for all _level 0_ dependencies in node, a lot of them don't adhere to the same
standards and are happy to accept either `patch` or `minor` versions of their own dependencies. Dependent libraries get updated and
released all the time, which could potentially result in a incompatible / broken dev workflow. 

### Getting Started

Just clone the repo and install the necessary node modules:

```sh
$ cd src/client
$ npm i                         # Install Node modules listed in ./package.json (may take a while the first time)
$ npm start                     # Compile and launch
```

You can then browse the app at http://localhost:3000

### Features

* [React](https://github.com/facebook/react) (`^0.14.3`)
  * Includes react-addons-test-utils (`^0.14.3`)
* [React-Router](https://github.com/rackt/react-router) (`1.0.2`)
* [Karma](https://github.com/karma-runner/karma)
  * PhantomJS
  * Code coverage reports
* [Babel](https://github.com/babel/babel) (`5.8.23`)
  * `react-transform-hmr` for hot reloading
  * `react-transform-catch-errors` with `redbox-react` for more visible error reporting
  * Uses babel runtime rather than inline transformations
* [Webpack](https://github.com/webpack/webpack)
  * Separates application code from vendor dependencies
  * webpack-dev-server
  * sass-loader with CSS extraction
  * Pre-configured folder aliases and globals
* [ESLint](http://eslint.org)
  * Uses [Airbnb's ESLint config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb) (with some softened rules)
  * Includes separate test-specific `.eslintrc` to work with Mocha and Chai


### Usage

```sh
npm start
```
Runs the webpack build system with webpack-dev-server (by default found at `localhost:3000`).

```sh
npm run dev
```
Same as `npm run start` but opens the debug tools in a new window.

```sh
npm run compile
```
Runs the webpack build system with your current NODE_ENV and compiles the application to disk (`~/dist`).

```sh
npm run test
```
Runs unit tests with Karma and generates coverage reports.

```sh
npm run test:dev
```
Similar to `npm run test`, but will watch for changes and re-run tests; does not generate coverage reports.

```sh
npm run lint
```
Run ESLint against all `.js` files in `~/src`. This used to be a webpack preloader, but the browser console output could get fairly ugly. If you want development-time linting, consider using an `eslint` plugin for your text editor.

```sh
npm run lint:tests
```
Lint all `.spec.js` files in `~/tests`.

```sh
npm run deploy
```
Helper script to run linter, tests, and then, on success, compile your application to disk.

```sh
npm run dist
```
Runs build and starts the backend server, mounting `dist` as root with port configured as `8888`

### Configuration

Basic project configuration can be found in `~/config/index.js`. Here you'll be able to redefine your src and dist directories, add/remove aliases, tweak your vendor dependencies, and more. For the most part, you should be able to make your changes in here without ever having to touch the webpack build configuration.

### Webpack

#### Configuration
The webpack compiler configuration is located in `~/build/webpack`. Here you'll find configurations for each environment; `development`, `production`, and `development_hot` exist out of the box. These configurations are selected based on your current `NODE_ENV`, with the exception of `development_hot` which will _always_ be used by webpack dev server.

#### Vendor Bundle
You can redefine which packages to treat as vendor dependencies by editing `vendor_dependencies` in `~/config/index.js`. These default to:

```js
[
  'history',
  'react',
  'react-redux',
  'react-router',
  'redux-router',
  'redux'
]
```

#### Aliases
As mentioned in features, the default webpack configuration provides some globals and aliases to make your life easier when importing from deep folder depths. These can be used as such:

```js
// current file: ~/src/views/some/nested/View.js
import SomeComponent from '../../../components/SomeComponent'; // without alias
import SomeComponent from 'components/SomeComponent'; // with alias
```

Available aliases:
```js
components  => '~/src/components'
constants   => '~/src/constants'
containers  => '~/src/containers'
layouts     => '~/src/layouts'
routes      => '~/src/routes'
services    => '~/src/services'
styles      => '~/src/styles'
utils       => '~/src/utils'
views       => '~/src/views'
```

### Styles

All `.scss` imports will be run through the sass-loader and extracted during production builds. If you're requiring styles from a base styles directory (useful for generic, app-wide styles), you can make use of the `styles` alias, e.g.:

```js
// current file: ~/src/components/some/nested/component/index.jsx
import 'styles/core.scss'; // this imports ~/src/styles/core.scss
```


However, to avoid duplication of common mixins and things like bootstrap-sass, implicit loading of files and modules is done in `styles/_base.scss`.
Furthermore, this `styles` directory is aliased for sass imports, which further eliminates manual directory traversing; this is especially useful for importing variables/mixins.

Here's an example:

```scss
// current file: ~/src/styles/some/nested/style.scss
// what used to be this (where base is ~/src/styles/_base.scss):
@import '../../base';

// can now be this:
@import 'base';
```

### Testing

To add a unit test, simply create `.spec.js` file anywhere in `~/tests`. Karma will pick up on these files automatically, and Mocha and Chai will be available within your test without the need to import them.

Coverage reports will be compiled to `~/coverage` by default. If you wish to change what reporters are used and where reports are compiled, you can do so by modifying `coverage_reporters` in `~/config/index.js`.

### OpenFin

Currently, this is only available for Windows clients but likely will change Q1 of 2016 when the OpenFin runtime moves to Electron.

To run the app in OpenFin, you need to:

```sh
$ [.../src/client] master ± npm i -g openfin-cli
$ [.../src/client] master ± openfin -l -c src/app.json
```

Now also supported as a built-in npm task:

```sh
$ [.../src/client] master ± npm run openfin
```

By default, OpenFin will connect to your local development server on port 3000 (`http://localhost:3000/`) but you can override that by passing an extra argument to the launcher:

```sh
$ [.../src/client] master ± openfin -l -c src/app.json -u http://somedomain.com
```

Once this completes and resources are fetched, OpenFin will create an app icon on your desktop with the last configuration setting that you can relaunch.

*nb* You may find you need to clear up the OpenFin cache, which includes localStorage and app window sizes and positions. Cache can be deleted manually by removing files from these folders:

 - For Windows Vista, 7, or 8: `%LOCALAPPDATA%\OpenFin\cache`
 - For Windows XP: `\Local Settings\Application Data\OpenFin\cache`
