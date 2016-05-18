FROM        __MONO_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        server    /server

# TODO: check that we don't need this
# ENV         PATH    /root/.dnx/runtimes/dnx-mono.__VDNX__/bin:$PATH

WORKDIR     /server/
CMD         dotnet restore
