FROM        __MONO_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        server    /server

WORKDIR     /server/
CMD         dotnet restore
