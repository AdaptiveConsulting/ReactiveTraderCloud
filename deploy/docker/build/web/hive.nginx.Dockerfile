FROM        <% container.base.nginx %>
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        dist  /www

COPY        nginx.dev.conf  /localhost/nginx.conf
COPY        nginx.prod.conf  /etc/nginx/nginx.conf

RUN         ln -sf /dev/stdout /var/log/nginx/access.log
RUN         ln -sf /dev/stderr /var/log/nginx/error.log

# run as prod
CMD         ["nginx", "-g", "daemon off;"]
