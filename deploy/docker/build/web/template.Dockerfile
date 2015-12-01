FROM        weareadaptive/nginx:__VNGINX__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        dist  /www
COPY        nginx.conf  /etc/nginx/nginx.conf

CMD         ["nginx", "-g", "daemon off;"]
