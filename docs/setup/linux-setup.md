## Installation

### Docker

The way to run ReactiveTrader on Linux is by using Docker.  
You can find the tutorial [here](docker-setup.md).

### Traditional installation 

Tested on Ubuntu 14.04.

This has also tested on a Raspberry Pi 2 running Raspbian Wheezy, although you will need these additional apt packages to run crossbar.io: `python-dev` `libffi-dev`

### Install DNVM/DNX and Mono

Follow the instructions provided [here](https://docs.asp.net/en/latest/getting-started/installing-on-linux.html).

Running `mono --version` should output:

```
$ mono --version
Mono JIT compiler version 4.2.1 (Stable 4.2.1.102/6dd2d0d Thu Nov 12 09:52:44 UTC 2015)
Copyright (C) 2002-2014 Novell, Inc, Xamarin Inc and Contributors. www.mono-project.com
	TLS:           __thread
	SIGSEGV:       altstack
	Notifications: epoll
	Architecture:  amd64
	Disabled:      none
	Misc:          softdebug 
	LLVM:          supported, not enabled.
	GC:            sgen
```

Ensure that DNX for mono is installed by running `dnvm upgrade -r mono`

Run `dnvm list` to check that the framework version in use is mono.

```
Active Version              Runtime Architecture OperatingSystem Alias
------ -------              ------- ------------ --------------- -----
  *    1.0.0-rc1-update1    mono                 linux/osx       default
```

### Install EventStore

Follow the instructions provided here:

http://docs.geteventstore.com/server/3.3.0/installing-from-debian-repositories//

### Install Crossbar.io

Follow the instructions provided [here](http://crossbar.io/docs/Installation-on-Ubuntu/)

## Running Reactive Trader

Start EventStore by running

```bash
$ sudo service eventstore start
```
In a separate terminal, start Crossbar from the `/src/server` folder by running:

```bash
$ crossbar start
```
Also from the `/src/server` working directory, install the packages required by running:

```bash
$ dnu restore
```
Then run the services:

```bash
$ cd Adaptive.ReactiveTrader.Server.Launcher
$ dnx run all
```
The services should now run and connect to Crossbar and EventStore.

Run the client app by following the instructions [here](../src/client/README.md)

### Problem running the app?

If you find any issue running the app or anything is missing the docs, please create [an issue on github](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/issues)
