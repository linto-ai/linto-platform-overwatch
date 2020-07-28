const debug = require('debug')('linto-overwatch:overwatch:watcher:logic:mongodb:models:android_users')

const sha1 = require('sha1')
const MongoModel = require('../model.js')

class LintoUsersModel extends MongoModel {
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

    validToken(url, requestToken) {
        //TODO: WIP
        return url === url
    }

    async checkAvailableSlot(url) {
        //TODO: WIP
        return true
    }
}

module.exports = new LintoUsersModel()