FROM        __NODE_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        client /client

WORKDIR     /client
ENTRYPOINT  npm install && npm run build
# ENTRYPOINT  npm install && npm test && npm run deploy:prod
