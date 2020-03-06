FROM node:11.10-alpine 

RUN \
  apk --no-cache  update \
  && apk --no-cache  upgrade \
  && apk add --no-cache --virtual .build-deps \
    gifsicle pngquant optipng libjpeg-turbo-utils \
    udev ttf-opensans chromium firefox-esr \
    libexif udev chromium-chromedriver xvfb \
  && rm -rf /var/cache/apk/* /tmp/*


ENV CHROME_BIN /usr/bin/chromium-browser

WORKDIR /client-tests

COPY . .
RUN npm set unsafe-perm true
RUN npm i

