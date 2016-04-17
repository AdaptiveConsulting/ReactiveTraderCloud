FROM        <% base.node.image %>:<% base.node.major %>.<% base.node.minor %>
MAINTAINER  <% maintainer %>

COPY        client /client

WORKDIR     /client
ENTRYPOINT  npm install && npm run deploy:prod
