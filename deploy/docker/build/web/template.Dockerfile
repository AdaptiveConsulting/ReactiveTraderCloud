FROM        weareadaptive/nginx:__VNGINX__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        dist  /www

COPY        dev.nginx.conf   /localhost/nginx.conf
COPY        prod.nginx.conf  /etc/nginx/nginx.conf

# run as prod
CMD         ["nginx", "-g", "daemon off;"]
