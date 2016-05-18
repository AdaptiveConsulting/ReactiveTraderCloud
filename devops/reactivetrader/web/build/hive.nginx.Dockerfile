FROM        <% base.nginx.image %>:<% base.nginx.major %>.<% base.nginx.minor %>
MAINTAINER  <% maintainer %>

COPY        dist  /www

COPY        nginx.dev.conf  /localhost/nginx.conf
COPY        nginx.prod.conf  /etc/nginx/nginx.conf

#RUN         ln -sf /dev/stdout /var/log/nginx/access.log
#RUN         ln -sf /dev/stderr /var/log/nginx/error.log

# run as prod
CMD         ["nginx", "-g", "daemon off;"]
