FROM        <% container.official.nginx %>
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

RUN         rm /etc/nginx/nginx.conf
RUN         rm /etc/nginx/conf.d/*

CMD ["nginx", "-g", "daemon off;"]
