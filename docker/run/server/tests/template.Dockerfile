FROM        weareadaptive/mono.net:__VERSION__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        server    /server

ENV         PATH    /root/.dnx/runtimes/dnx-mono.__VERSION__/bin:$PATH

WORKDIR     /server/
RUN         dnu restore

WORKDIR     /server/Adaptive.ReactiveTrader.Server.Tests/
RUN         dnx test -parallel none
