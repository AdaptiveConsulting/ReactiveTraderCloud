# Reactive Trader Launcher

This is a standalone launcher to launch different apps such as Reactive Trader and Reactive Analytics.

## DEV Machine Setup

Please ensure you have [Node](https://nodejs.org)(>=v10), [npm](https://github.com/npm/npm)(>=v5) and [Git](https://git-scm.com/downloads) installed on your machine and on your path.

### Mac and Windows

There are no additional packages to install other than Git and a recent build of Node.

### Linux

You might want to [increase the limit](http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc) on the number of files Linux will watch. [Here's why](https://github.com/coryhouse/react-slingshot/issues/6).

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Running the app locally

Clone the repo and install the necessary node modules:

```sh
cd /src/launcher/
npm install  # Install Node modules listed in ./package.json
npm start    # Compile and launch the webpack dev server. By default, the client connects to the dev environment.
```

You can then browse the app at [http://localhost:3000](http://localhost:3000)

### Additional command line options

Runs unit tests with Jest.

```sh
npm run test
```

Create a production version of the application in the dist folder

```sh
npm run build

# You can also build versions for particular enviroment
npm run build:demo-backend
npm run build:dev-backend

```

## Openfin

How to run local instance of RT client in OpenFin

1. Start the client locally per above steps

2. Start openfin

```sh
npm run openfin
```

### Openfin launcher

```sh
npm run openfin:launcher
```


