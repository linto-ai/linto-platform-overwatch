FROM node

WORKDIR /usr/src/app/linto-platform-overwatch

COPY . /usr/src/app/linto-platform-overwatch

RUN npm install

CMD ["node", "index.js"]