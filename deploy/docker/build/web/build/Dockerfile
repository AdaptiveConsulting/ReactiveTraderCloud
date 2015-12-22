FROM        weareadaptive/nginx:1.9.7
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        dist  /www

COPY        dev.nginx.conf  /localhost/nginx.conf
COPY        prod.nginx.conf  /etc/nginx/nginx.conf

RUN         ln -sf /dev/stdout /var/log/nginx/access.log
RUN         ln -sf /dev/stderr /var/log/nginx/error.log

# run as prod
CMD         ["nginx", "-g", "daemon off;"]
