FROM node:alpine

# Create app directory
WORKDIR /app

# Installing dependencies
COPY package.json /app

RUN yarn install

COPY . /usr/src/app

CMD "yarn" "run" "start"