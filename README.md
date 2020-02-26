# LinTO-Platform-Overwatch

LinTO Platform Overwatch is a MQTT global subscriber for a fleet of LinTO clients. It registers every events in the persistent storage include in [LinTO-Platform-Admin](https://github.com/linto-ai/linto-platform-admin). The persistent storage on LinTO Admin is based on Mongo.

The persistent LinTO events are :
* `connexion` : **connected** and **disconnected**
* `date` : date of the last modification

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development. Thise module require at least for working :
* An mqtt server
* [LinTO-Platform-Admin](https://github.com/linto-ai/linto-platform-admin), which include the data persistent storage

Nodejs shall be installed `sudo apt-get install nodejs`, also npm shall be installed `sudo apt-get install npm`

### Installing
A step by step series of command that will give you a development environment running
```
git clone https://github.com/linto-ai/linto-platform-overwatch.git
cd linto-platform-overwatch
npm install
```

### Configuration environment
The file `.envdefault` contain the recommended default configuration that we suggest.
If you want to use the default environement then copy the file `cp .envdefault .env`. You can update the `.env` file to manage your personal configuration if needed

Information about mqtt server
* `LINTO_STACK_MQTT_HOST` : MQTT host address
* `LINTO_STACK_MQTT_PORT` : MQTT running port (mqtt default : 1883)

Information about Mongo
* `LINTO_STACK_MONGO_HOST` : mongodb host address
* `LINTO_STACK_MONGO_PORT` : mongodb running port (mongo default port : 27017)
* `LINTO_STACK_MONGO_DB_NAME` : mongodb database name (default linto)
* `LINTO_STACK_MONGO_COLLECTION_LINTOS` : LinTO collection name for linto-platform-admin mongoDb collection (default lintos)
* `LINTO_STACK_MONGO_COLLECTION_LOG` : LinTO collection name for log (default statusLog)

Depending of MongoDb and MQTT server settings, this parameter can be optional
* `LINTO_STACK_MQTT_USER` : MQTT authentication user
* `LINTO_STACK_MQTT_PASSWORD` : MQTT authentication password
* `LINTO_STACK_MONGO_USER` : MongoDB authentication user
* `LINTO_STACK_MONGO_PASSWORD` : MongoDB authentication password

### Run project
Normal : `npm run start`
Debug : `DEBUG=* npm run start`

## Docker
### Install Docker

You will need to have Docker installed on your machine. If they are already installed, you can skip this part.
Otherwise, you can install them referring to [https://docs.docker.com/engine/installation/](https://docs.docker.com/engine/installation/ "Install Docker")

## Build
Next step is to build the docker image with the following command `docker build -t linto-overwatch .`
Then you just need to run bls image`docker run -d -it linto-overwatch`

### Stack
You will find the full process to deploy the LinTO platform here : [LinTO-Platform-Stack](https://github.com/linto-ai/linto-platform-stack)