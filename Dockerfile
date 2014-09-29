FROM ubuntu:14.04
MAINTAINER psychic-octo

RUN apt-get update && apt-get install -y nodejs npm git

COPY . /src
RUN cd /src && npm install

EXPOSE 3000
RUN mongod

CMD ["node", "/src/index.js"]