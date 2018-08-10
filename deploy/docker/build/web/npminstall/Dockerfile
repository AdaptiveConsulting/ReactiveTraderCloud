FROM        __NODE_CONTAINER__
MAINTAINER  weareadaptive <thibault@weareadaptive.com>

COPY        client/package.json client/package.json

RUN         npm install

COPY        client /client

WORKDIR     /client

ENTRYPOINT  ["npm", "run", "build"]
# ENTRYPOINT  npm install && npm test && npm run deploy:prod
