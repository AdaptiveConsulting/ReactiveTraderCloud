# Desktop Client Support with OpenFin

[OpenFin](http://openfin.co) is an embedded desktop browser client, based on top of Chromium (at time of writing) and
Electron soon. It allows you to package and run your web apps in an enriched browser with control over communication,
notifications, browser chrome, users and much more.

## Installing

By default, doing an `npm install` in the client folder will also get a small OpenFin cli binary.

You can then run the built-in npm task:

```sh
$ [.../src/client] $ npm run openfin
```

You can also do this separately to the npm workflow. Get [node](https://nodejs.org/en/) working first, then do the following:

```sh
[:~/projects/reactive-trader-cloud/src] $ npm install -g openfin-cli
```

You can now run it against the `app.json`, which will fetch the required runtime and create a desktop shortcut for you.

```sh
[:~/projects/reactive-trader-cloud/src] $ cd client
[:~/projects/reactive-trader-cloud/src/client] $ openfin -c src/app.json -l
```

The `-l` argument launches OpenFin in addition to updating `app.json` and creating a shortcut (one-off).

> NB: Prior to Electron release, OpenFin is only available for windows

## Resetting OpenFin

You may find you need to clear up the OpenFin cache, which includes localStorage and app window sizes and positions of tear-offs.
Cache can be deleted manually by removing files from these folders:

 - For Windows Vista, 7, or 8: `%LOCALAPPDATA%\OpenFin\cache`
 - For Windows XP: `\Local Settings\Application Data\OpenFin\cache`

