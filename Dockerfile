FROM node

WORKDIR /code

RUN npm install -g yarn --loglevel=warn --no-progress

COPY package.json .
COPY yarn.lock .
RUN yarn install --production

ENV DBHOST=rethinkdb
ENV PORT=8080

COPY Makefile .
COPY ./dist/ ./dist
COPY ./server/ ./server
EXPOSE 8080
CMD ["make","start-server-prod"]
