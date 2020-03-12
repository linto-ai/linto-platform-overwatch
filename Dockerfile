FROM node

WORKDIR /usr/src/app/linto-platform-overwatch

COPY . /usr/src/app/linto-platform-overwatch

RUN npm install

HEALTHCHECK CMD node docker-healthcheck.js || exit 1

EXPOSE 80

CMD ["node", "index.js"]