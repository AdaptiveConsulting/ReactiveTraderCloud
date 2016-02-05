FROM        <% container.base.node %>
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        client /client

WORKDIR     /client
ENTRYPOINT  npm install && npm run deploy:prod
