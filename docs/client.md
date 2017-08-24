# Reactive Trader Cloud - UI

The trading client GUI is a single page app (SPA) build using JavaScript vNext (i.e. Ecmascript 6 transpiled with [babeljs.io](http://babeljs.io)).

## High level technologies

* Html, javascript, css etc is built (i.e. transpiled and bundled) with [webpack](https://webpack.github.io). Script targets in `package.json` kick off webpack, tests etc.
* Tests use [Karma](https://karma-runner.github.io) & [Jasmine](http://jasmine.github.io).
* Streaming data abstractions are build with [RxJs](https://github.com/Reactive-Extensions/RxJS).
* GUI state management is done with [esp-js](https://github.com/esp/esp-js), a scalable state management library that puts your model at the forefront of the design. It works well with uni directional data flow architecture.
* Connectivity to the backend is done via [AutobahnJs](http://autobahn.ws/js/).
* Styles build using [Sass](http://sass-lang.com/).

## Machine Setup
Please ensure you have [Node](https://nodejs.org)(>=v5), [npm](https://github.com/npm/npm)(>=v3.5) and [Git](https://git-scm.com/downloads) installed on your machine and on your path.

### Mac
There are no additional packages to install other than Git and a recent build of Node.

### Linux
You might want to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### Windows

1. Install the C++ Compiler. [Visual Studio Express](https://www.visualstudio.com/en-US/products/visual-studio-express-vs) comes bundled with a free C++ compiler. Or, if you already have Visual Studio installed: Open Visual Studio and go to File -> New -> Project -> Visual C++ -> Install Visual C++ Tools for Windows Desktop. The C++ compiler is used to compile browser-sync (and perhaps other Node modules).

## Starting the GUI

Clone the repo and install the necessary node modules:

```sh
npm install  # Install Node modules listed in ./package.json
npm start    # Compile and launches the webpack dev server. By default, the client connects to a demo environment.
```

You can then browse the app at [http://localhost:3000](http://localhost:3000)

### Additional command line options

```sh
npm run dev:local
```

Similar to `npm run start`, but configures the client to point to your local backend server. You can then browse the app at [http://localhost:3000](http://localhost:3000)).

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

### Openfin

```sh
npm run dev:openfin:cloud
```
Starts the app in Openfin pointing to the demo environment

```sh
npm run dev:openfin:local
```

Starts the app in Openfin pointing to your local server
