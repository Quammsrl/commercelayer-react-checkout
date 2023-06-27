FROM node:16.13.2 AS dev-stage
WORKDIR /app

COPY package*.json ./

RUN npm install
COPY ./ .
COPY .env.europe .env

FROM dev-stage AS build-stage
RUN  npm run build
CMD npm start 3000
