# Setting up the dev environment on Mac OSX

First install Homebrew, if you don't have it yet

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Install the .NET Version Manager (it's used to install and update different .NET runtimes like mono or Microsoft Core CLR)

```
	curl -sSL https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.sh | DNX_BRANCH=dev sh && source ~/.dnx/dnvm/dnvm.sh
```

We will use mono for this project, let's install it

```
brew update && brew install mono
```

Install DNX (.NET Execution Environment) for Mono

```
dnvm upgrade -r mono
```

Now let's install Visual Studio Code (it's a cut down version of VS which runs on Mac, Linux and Windows)

```
brew cask install visual-studio-code
```

Of course you need to clone this repository, if you have not done that yet run the following command in the folder of your choice

```
git clone git@github.com:AdaptiveConsulting/AdaptiveTrader.git
```

Open the AdaptiveTrader folder in Visual Studio Code to look at the code base.

To run it, you need to use the following command in the AdaptiveTrader/Server/ directory

```
dnx run
```