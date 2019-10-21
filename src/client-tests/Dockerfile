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
    libexif udev chromium-chromedriver xvfb \
  && rm -rf /var/cache/apk/* /tmp/*


ENV CHROME_BIN /usr/bin/chromium-browser

WORKDIR /client-tests

COPY . .
RUN npm i

