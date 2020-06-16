const debug = require('debug')('linto-overwatch:overwatch:watcher:logic:mongodb:models:linto_users')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const TOKEN_DAYS_TIME = 10
const REFRESH_TOKEN_DAYS_TIME = 14

const MongoModel = require('../model.js')

class LintoUsersModel extends MongoModel {
    constructor() {
        super('linto_users')
    }

    async findById(id) {
        try {
            return await this.mongoRequest({ id })
        } catch (err) {
            console.error(err)
            return err
        }
    }

    async findOne(username) {
        try {
            let user = await this.mongoRequest(username)
            return user[0]
        } catch (err) {
            console.error(err)
            return err
        }
    }

    validatePassword(password, user) {
        const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
        return user.hash === hash
    }

    generateJWT(user) {
        const today = new Date()
        const expirationDate = new Date(today)
        expirationDate.setDate(today.getDate() + 60)

        return {
            auth_token: jwt.sign({
                email: user.email,
                id: user._id,
                exp: parseInt(expirationDate.getTime() / 1000, TOKEN_DAYS_TIME),
            }, process.env.LINTO_STACK_OVERWATCH_JWT_SECRET),
            refresh_token: jwt.sign({
                email: user.email,
                id: user._id,
                exp: parseInt(expirationDate.getTime() / 1000, REFRESH_TOKEN_DAYS_TIME),
            }, process.env.LINTO_STACK_OVERWATCH_JWT_SECRET),

            expiration_date: parseInt(expirationDate.getTime() / 1000, 10),
            session_id: user._id
        }
    }

    toAuthJSON(user) {
        let token = this.generateJWT(user)
        return {
            _id: user._id,
            email: user.email,
            token: token,
        }
    }
}

module.exports = new LintoUsersModel()