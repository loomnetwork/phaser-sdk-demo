FROM node:10.3.0-slim

EXPOSE 3000/tcp

ENV PROTOBUF_VERSION 3.5.1

WORKDIR /app

COPY . /app

RUN buildDeps='unzip' \
  && apt-get update && apt-get install -y $buildDeps --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && curl -OL https://github.com/google/protobuf/releases/download/v${PROTOBUF_VERSION}/protoc-${PROTOBUF_VERSION}-linux-x86_64.zip \
  && unzip protoc-${PROTOBUF_VERSION}-linux-x86_64.zip -d /usr/local \
  && rm protoc-${PROTOBUF_VERSION}-linux-x86_64.zip \
  && apt-get purge -y --auto-remove $buildDeps \
  && yarn && yarn run proto \
  && sed -ie "s/127\.0\.0\.1/'+location.hostname+'/g" src/simpleContract.js

CMD ["yarn", "run", "dev"]
