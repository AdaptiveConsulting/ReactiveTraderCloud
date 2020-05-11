FROM node:12.16-alpine as builder
WORKDIR '/app'

ARG CI
ARG NPM_TOKEN
ARG REACT_APP_BUILD_VERSION

ENV CI=$CI
ENV NPM_TOKEN=$NPM_TOKEN
ENV REACT_APP_BUILD_VERSION=$REACT_APP_BUILD_VERSION

COPY ./package*.json ./
RUN if [[ -n "$NPM_TOKEN" ]] ; then echo "Setting NPM_TOKEN in npm config" && npm config set '//registry.npmjs.org/:_authToken' '$NPM_TOKEN' ; fi
# if NPM_TOKEN is not set, ignore optional packages, as they won't be able to install on the build server
RUN if [[ -n "$NPM_TOKEN" ]] ; then echo "Installing all packages" && npm ci ; else echo "Ignoring optional packages" && npm ci --no-optional ; fi
COPY . .

RUN npm run test -- --coverage
RUN npm run build
RUN npm run storybook:build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/storybook/build /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/storyhtml
RUN cp /usr/share/nginx/html/index.html /usr/share/nginx/html/storyhtml/index.html
COPY --from=builder /app/build /usr/share/nginx/html
