FROM        __NODE_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        client /client
COPY        npm-global.sh /client/npm-global.sh

WORKDIR     /client

RUN         chmod 755 npm-global.sh
RUN         ./npm-global.sh

ENTRYPOINT  npm install && npm run build
# ENTRYPOINT  npm install && npm test && npm run deploy:prod
