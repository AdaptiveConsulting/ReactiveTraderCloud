FROM        __NODE_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        client /client
COPY        npm-run.sh /client/npm-run.sh

WORKDIR     /client

RUN         chmod 755 npm-run.sh

ENTRYPOINT  ["bash", "npm-run.sh"]
# ENTRYPOINT  npm install && npm test && npm run deploy:prod
