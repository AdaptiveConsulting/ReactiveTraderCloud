FROM        <% base.nginx.official_image %>
MAINTAINER  <% maintainer %>

RUN         rm /etc/nginx/nginx.conf
RUN         rm /etc/nginx/conf.d/*

RUN         ln -sf /dev/stdout /var/log/nginx/access.log
RUN         ln -sf /dev/stderr /var/log/nginx/error.log

CMD         ["nginx", "-g", "daemon off;"]
