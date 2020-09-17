const debug = require('debug')('linto-overwatch:overwatch:watcher:logic:mongodb:models:webapp_host')

const MongoModel = require('../model.js')

let registeredUser = {}

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

    async updateAndRegister(payload, sn, slotData) {
        registeredUser[sn] = slotData
        await this.update(payload)
    }

    async updateAndDisconnect(payload, sn) {
        delete registeredUser[sn]
        await this.update(payload)
    }

    validApplicationAuth(webapp, requestToken) {
        return webapp.applications.find(app => (app.requestToken === requestToken && app.slots.length < app.maxSlots))
    }

    async getSlot(tokenData, sn) {
        if (tokenData && tokenData.data) {
            let data = tokenData.data
            await this.findOne({ originUrl: data.originUrl })
                .then(webapp => {
                    webapp.applications.find(app => {
                        if (app.applicationId === data.applicationId && app.maxSlots > app.slots.length) {
                            app.slots.indexOf(sn) === -1 ? app.slots.push(sn) : undefined
                            let slotData = { originUrl: webapp.originUrl, applicationId: app.applicationId }
                            this.updateAndRegister(webapp, sn, slotData)
                        }
                    })
                })
        }
    }

    async deleteSlot(sn) {
        if (registeredUser[sn] === undefined)
            return
        await this.findOne({ originUrl: registeredUser[sn].originUrl })
            .then(webapp => {
                webapp.applications.find(app => {
                    if (app.applicationId === registeredUser[sn].applicationId) {
                        debug(app.slots)
                        app.slots = app.slots.filter(slot => slot !== sn)
                        debug(app.slots)
                    }
                })
                this.updateAndDisconnect(webapp, sn)
            })
    }
}

module.exports = new LintoWebUsersModel()