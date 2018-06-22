FROM        __NGINX_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        dist  /www

COPY        start.sh            /web/start.sh
COPY        dev.nginx.conf      /localhost/nginx.conf
COPY        prod.nginx.conf     /etc/nginx/nginx.conf

RUN         chmod 755 /web/start.sh
RUN         chmod -R 755 /www

# run as prod
CMD         /web/start.sh
