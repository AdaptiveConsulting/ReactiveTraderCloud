FROM node:14-alpine AS builder
WORKDIR /app

ARG CI
ARG REACT_APP_BUILD_VERSION

ENV CI=$CI
ENV VITE_BUILD_VERSION=$REACT_APP_BUILD_VERSION

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm test
RUN npm run build

FROM openresty/openresty:alpine-fat
RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-template
EXPOSE 3000

COPY ./nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/local/openresty/nginx/html
