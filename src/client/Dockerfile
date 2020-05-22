FROM node:12.16-alpine as builder
RUN apk add g++ make python
WORKDIR '/app'

ARG CI
ARG NPM_TOKEN
ARG REACT_APP_BUILD_VERSION

ENV CI=$CI
ENV NPM_TOKEN=$NPM_TOKEN
ENV REACT_APP_BUILD_VERSION=$REACT_APP_BUILD_VERSION

COPY ./package*.json ./
COPY . .
RUN if [[ -n "$NPM_TOKEN" ]] ; \
    then \
        echo "NPM_TOKEN defined, including private packages" && \
        echo -e "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc && \
        npm ci && \
        npm run test -- --coverage && \
        npm run build:finsemble && \
        npm run storybook:build ; \
    else \
        echo "NPM_TOKEN not defined, ignoring optional packages" && \
        npm ci --no-optional && \
        npm run test -- --coverage && \
        npm run build && \
        npm run storybook:build ; \
    fi

# We use openresty to make use of the lua scripting for nginx
FROM openresty/openresty:alpine-fat
EXPOSE 3000

# Copy website resourcees
COPY --from=builder /app/storybook/build /usr/local/openresty/nginx/html
RUN mkdir /usr/local/openresty/nginx/html/storyhtml && \
    cp /usr/local/openresty/nginx/html/index.html /usr/local/openresty/nginx/html/storyhtml/index.html
COPY --from=builder /app/build /usr/local/openresty/nginx/html

# Install lua template engine
RUN /usr/local/openresty/luajit/bin/luarocks install lua-resty-template

# Copy nginx config
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
