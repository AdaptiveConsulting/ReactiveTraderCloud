FROM node:11.10-alpine as builder
WORKDIR '/app'

ARG CI
ARG NPM_TOKEN
ARG REACT_APP_BUILD_VERSION

COPY .npmrc .npmrc
COPY ./package*.json ./
RUN npm ci
RUN rm -f .npmrc
COPY . .

ENV CI=$CI
ENV NPM_TOKEN=$NPM_TOKEN
ENV REACT_APP_BUILD_VERSION=$REACT_APP_BUILD_VERSION

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
