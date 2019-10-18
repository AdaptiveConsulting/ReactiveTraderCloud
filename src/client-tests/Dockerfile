FROM node:11.10-alpine 

RUN \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && apk --no-cache  update \
  && apk --no-cache  upgrade \
  && apk add --no-cache --virtual .build-deps \
    gifsicle pngquant optipng libjpeg-turbo-utils \
    udev ttf-opensans chromium firefox \
  && rm -rf /var/cache/apk/* /tmp/*

RUN libexif udev chromium-chromedriver xvfb

ENV CHROME_BIN /usr/bin/chromium-browser

WORKDIR /client-tests

COPY ./package*.json ./
RUN npm i
COPY ./e2e ./e2e
COPY ./tsconfig.json .


## TODO CMD ['npm i e2e -- --chromeDriver=/usr/bin/chromeDriver']
