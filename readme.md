# Setting up the dev environment on Mac OSX

1. download [Visual studio code](https://code.visualstudio.com/)
2. install DNVM (.NET Version Manager): 
```
	curl -sSL https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.sh | DNX_BRANCH=dev sh && source ~/.dnx/dnvm/dnvm.sh
```

3. install [homebrew](http://brew.sh/)
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

4. Install Mono

```
brew update && brew install mono
```

5. install DNX for Mono

```
dnvm upgrade -r mono
```

