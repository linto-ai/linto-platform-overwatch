# LinTO-Platform-Overwatch

LinTO Platform Overwatch will check any status change from a LinTO on the MQTT-Broker then update their status change on mongo database associated.

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development.

## Installing
A step by step series of examples that tell you how to get a development environment running
```
git clone https://github.com/linto-ai/linto-platform-overwatch.git
cd linto-platform-overwatch
npm install
```

## Configuration environment
First copy the default environment file `cp .envdefault .env`, then update the `.env` file to manage your personal configuration

Here are the information about mqtt
* `MQTT_HOST` : MQTT address
* `MQTT_PORT` : MQTT running port (default 1883)

Here are the information about Mongo
* `MONGO_HOST` : mongodb running host
* `MONGO_PORT` : mongodb running port
* `MONGO_DB_NAME` : mongodb database name (default linto)

If MongoDb or MQTT user are empty they will not be used
* `MQTT_USER` : MQTT authentication user
* `MQTT_PSW` : MQTT authentication password
* `MONGO_USER` : Login for mongoDb authentication
* `MONGO_PSW` : Password for mongoDb authentication

Mongo collection to update
* `MONGO_COLLECTION_LINTO` : LinTO collection name for linto-platform-admin  mongoDb collection
* `MONGO_COLLECTION_LOG` : LinTO collection name for log

## Run project
Normal : `npm run start`
Debug : `DEBUG=* npm run start`

# Docker
## Install Docker

You will need to have Docker installed on your machine. If they are already installed, you can skip this part.
Otherwise, you can install them referring to [https://docs.docker.com/engine/installation/](https://docs.docker.com/engine/installation/ "Install Docker")

## Build
Next step is to build the docker with the following command `docker build -t linto-overwatch .`
Then you just need to start it with `docker run -d -it linto-overwatch`

## Stack
You will find the full process to deploy the LinTO platform here : [LinTO-Platform-Stack](https://github.com/linto-ai/linto-platform-stack)

