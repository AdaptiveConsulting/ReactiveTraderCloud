# Desktop Client Support with OpenFin

[OpenFin](http://openfin.co) is an embedded desktop browser client, based on top of Chromium (at time of writing) and
Electron soon. It allows you to package and run your web apps in an enriched browser with control over communication,
notifications, browser chrome, users and much more.

## Installing

You need to get [node](https://nodejs.org/en/) working first. To install the OpenFin configurator, do the following:

```sh
[:~/projects/reactive-trader-cloud/src] master(+23/-0)+ ± npm install -g openfin-cli
```

You can now run it against the `app.json`, which will fetch the required runtime and create a desktop shortcut for you.

```sh
[:~/projects/reactive-trader-cloud/src] master(+23/-0)+ ± cd client
[:~/projects/reactive-trader-cloud/src/client] master(+23/-0)+ ± $ openfin -c src/app.json
```

Optionally, you can also launch it via adding `-l` to the above line.

> NB: Prior to Electron release, OpenFin is only available for windows

## Resetting OpenFin

You may find you need to clear up the OpenFin cache, which includes localStorage and app window sizes and positions of tearoffs.
Cache can be deleted manually by removing files from these folders:

 - For Windows Vista, 7, or 8: `%LOCALAPPDATA%\OpenFin\cache`
 - For Windows XP: `\Local Settings\Application Data\OpenFin\cache`

