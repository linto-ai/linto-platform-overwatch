const debug = require('debug')('linto-overwatch:overwatch:watcher:logic:mongodb:models:android_users')

const sha1 = require('sha1')
const MongoModel = require('../model.js')

class LintoWebUsersModel extends MongoModel {
    constructor() {
        super('webapp_hosts')
    }

    async findById(id) {
        try {
            return await this.mongoRequest(id)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async findOne(url) {
        try {
            let user = await this.mongoRequest(url)



            if(user[0].maxSlots <= user[0].slots.length){
                throw 'No slot available for the requested Url'
            }

            return user[0]
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async update(payload) {
        const query = {
            _id: payload._id
        }
        delete payload._id
        let mutableElements = payload

        return await this.mongoUpdate(query, mutableElements)
    }

    validUserToken(requestToken, user) {
        //TODO: WIP increment slot taken
        return requestToken === user.requestToken
    }

    async checkAvailableSlot(url) {
        //TODO: WIP
        try {
            let user = await this.mongoRequest(url)

            if (user.slot === 20)
                return true
            return false
        } catch (err) {
            console.error(err)
            return false
        }
    }
}

module.exports = new LintoWebUsersModel()


/*
{
    "title": "webapp_hosts",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "originUrl": {
                "type": "string",
                "format": "uri"
            },
            "requestToken": {
                "type": "string"
            },
            "maxSlots": {
                "type": "integer"
            },
            "slots": {
                "type": "array",
                "items": {
                    "type": "object"
                }
            },
            "applications": {
                "type": "array"
            }
        }
    },
    "required": ["originUrl", "requestToken", "maxSlots", "applications"]
}
*/