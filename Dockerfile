# base image
FROM node:9.6.1

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN npm install

# add app
COPY . /usr/src/app

# start app
CMD node server.js