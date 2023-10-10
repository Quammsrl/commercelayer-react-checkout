FROM node:18.14.2-alpine AS dev-stage
WORKDIR /app

COPY package*.json ./

RUN npm install
COPY ./ .
COPY .env .env

FROM dev-stage AS build-stage
RUN  npm run build
CMD npm start 3000
