FROM        <% container.base.crossbar %>
MAINTAINER 	weareadaptive <thibault@weareadaptive.com>

COPY        .crossbar  /server/.crossbar

WORKDIR     /server
CMD         crossbar start
