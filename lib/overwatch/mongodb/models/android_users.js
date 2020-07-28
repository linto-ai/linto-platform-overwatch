const debug = require('debug')('linto-overwatch:overwatch:watcher:logic:mongodb:models:android_users')

const sha1 = require('sha1')
const MongoModel = require('../model.js')

class LintoUsersModel extends MongoModel {
    constructor() {
        super('android_users')
    }

    async findById(id) {
        try {
            return await this.mongoRequest(id)
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async findOne(email) {
        try {
            let user = await this.mongoRequest(email)
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

    validatePassword(password, user) {
        return user.pswdHash === sha1(password + user.salt)
    }
}

module.exports = new LintoUsersModel()