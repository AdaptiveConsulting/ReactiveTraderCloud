FROM        __NGINX_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        dist  /www

COPY        start.sh /web/start.sh
COPY        dev.nginx.conf  /localhost/nginx.conf
COPY        prod.nginx.conf  /etc/nginx/nginx.conf

RUN         ln -sf /dev/stdout /var/log/nginx/access.log
RUN         ln -sf /dev/stderr /var/log/nginx/error.log
RUN         chmod 755 /web/start.sh

# run as prod
CMD         /web/start.sh
