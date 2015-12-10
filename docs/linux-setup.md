## Installation

Tested on Ubuntu 14.04.

Also tested on a Raspberry Pi 2 running Raspbian Wheezy, though you may need these additional packages to run crossbar.io: `python-dev` `libffi-dev`

### Install DNVM/DNX and Mono

Follow the instructions provided here:

https://docs.asp.net/en/latest/getting-started/installing-on-linux.html

Running `mono --version` should give something like below:

```
qooroo@qooroo-VirtualBox:~/dev$ mono --version
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
  *    1.0.0-rc1-final      mono                 linux/osx       default
```

### Install EventStore

Follow the instructions provided here:

http://docs.geteventstore.com/server/3.3.0/installing-from-debian-repositories//


### Install Crossbar.io

Follow the instructions provided here:

http://crossbar.io/docs/Installation-on-Ubuntu/

## Running Reactive Trader

Start EventStore by running

```bash
$ sudo service eventstore start
```
In a separate terminal, start Crossbar from the `/src/server` folder by running

```bash
$ crossbar start
```
Also from the `/src/server` working directory, install the packages required by running

```bash
$ dnu restore
```
And then run the services

```bash
$ dnx -p Adaptive.ReactiveTrader.Server.Launcher a b exec p ref
```
The services should now run and connect to the Crossbar and EventStore

Run the client app by following the instructions [here](../src/client/README.md)

