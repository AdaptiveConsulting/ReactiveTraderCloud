FROM        <% container.base.mono %>
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        server    /server

ENV         PATH    /root/.dnx/runtimes/dnx-mono.<% version.official.dnx %>/bin:$PATH

WORKDIR     /server/
CMD         dnu restore
