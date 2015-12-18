FROM        weareadaptive/mono:__VDNX__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        server    /server

ENV         PATH    /root/.dnx/runtimes/dnx-mono.__VDNX__/bin:$PATH

WORKDIR     /server/
CMD         dnu restore
