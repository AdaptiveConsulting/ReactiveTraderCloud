FROM        <% base.mono.image %>:<% base.mono.major %>.<% base.mono.minor %>
MAINTAINER  <% maintainer %>

COPY        server    /server

ENV         PATH    /root/.dnx/runtimes/dnx-mono.<% base.mono.dnx_version %>/bin:$PATH

WORKDIR     /server/
CMD         dnu restore
