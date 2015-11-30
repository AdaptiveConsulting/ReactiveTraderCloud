FROM        weareadaptive/mono:__VDNX__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        server    /server

ENV         PATH    /root/.dnx/runtimes/dnx-mono.__VDNX__/bin:$PATH

WORKDIR     /server/
RUN         dnu restore

WORKDIR     /server/Adaptive.ReactiveTrader.Server.Tests/
RUN         dnx test -parallel none

WORKDIR     /server
