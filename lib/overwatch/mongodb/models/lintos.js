const debug = require('debug')('linto-overwatch:overwatch:watcher:logic:mongodb:models:lintos')


const MongoModel = require('../model.js')

class LintosModel extends MongoModel {
    constructor() {
        super('lintos')
    }

    // Get a linto by its "sn" (serial number)
    async getLintoBySn(sn) {
        try {
            return await this.mongoRequest({ sn })
        } catch (err) {
            console.error(err)
            return err
        }
    }

    // Update a linto

    //offline or offline
    async updateLinto(payload) {
        try {
            //TODO: getLintoBySn ???
            const query = { sn: payload.sn }
            let mutableElements = payload
            delete mutableElements.sn

            return await this.mongoUpdate(query, mutableElements)
        } catch (err) {
            return err
        }
    }
}

module.exports = new LintosModel()