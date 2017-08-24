FROM        __NGINX_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        nginx.conf      /etc/nginx/nginx.conf

CMD         nginx -g 'daemon off;'
