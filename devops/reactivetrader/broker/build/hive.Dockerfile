FROM        <% base.crossbar.image %>:<% base.crossbar.major %>.<% base.crossbar.minor %>
MAINTAINER 	<% maintainer %>

COPY        .crossbar  /server/.crossbar

WORKDIR     /server
CMD         crossbar start
