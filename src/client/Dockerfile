FROM node:12.16-alpine as builder
RUN apk add g++ make python
WORKDIR /app

ARG CI
ARG NPM_TOKEN
ARG REACT_APP_BUILD_VERSION

ENV CI=$CI
ENV NPM_TOKEN=$NPM_TOKEN
ENV REACT_APP_BUILD_VERSION=$REACT_APP_BUILD_VERSION

COPY ./package*.json ./
RUN npm ci

COPY . .
RUN npm run test -- --coverage
RUN npm run build

# We use openresty to make use of the lua scripting for nginx
FROM openresty/openresty:alpine-fat
EXPOSE 3000

# Copy website resourcees
COPY --from=builder /app/build /usr/local/openresty/nginx/html

# Install lua template engine
RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-template

# Copy nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
