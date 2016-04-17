FROM <% base.nginx.image %>:<% base.nginx.major %>.<% base.nginx.minor %>
MAINTAINER <% maintainer %>

COPY nginx.conf /etc/nginx/nginx.conf
