FROM node:12.16-alpine as builder
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

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/storybook/build /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/storyhtml && \
    cp /usr/share/nginx/html/index.html /usr/share/nginx/html/storyhtml/index.html
COPY --from=builder /app/build /usr/share/nginx/html
