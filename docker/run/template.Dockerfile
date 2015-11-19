FROM        weareadaptive/mono.net:__VERSION__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        src    /src

ENV         PATH    /root/.dnx/runtimes/dnx-mono.__VERSION__/bin:$PATH

WORKDIR     /src/server/
RUN         dnu restore

WORKDIR     /src/server/Adaptive.ReactiveTrader.Server.Tests/
RUN         dnx test -parallel none
