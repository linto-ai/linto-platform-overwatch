/*
 * Copyright (c) 2017 Linagora.
 *
 * This file is part of Business-Logic-Server
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const debug = require('debug')('linto-overwatch:overwatch:watcher:logic:mongo')
const mongodb = require('mongodb')

class MongoController {
  constructor() {
    let urlMongo = 'mongodb://'
    if (process.env.MONGO_USER)
      urlMongo += process.env.MONGO_USER + ':' + process.env.MONGO_PSW + '@'
    urlMongo += process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB_NAME

    if (process.env.MONGO_USER)
      urlMongo += '?authSource=' + process.env.MONGO_DB_NAME
    this.init(urlMongo)

    return this
  }

  async init(urlMongo) {
    this.client = await mongodb.MongoClient.connect(urlMongo, {
      useNewUrlParser: true
    })
    this.clientDb = await this.client.db(process.env.MONGO_DB_NAME)

    this.clientDb.on('close', () => { console.error('-> lost db connection') })
    this.clientDb.on('reconnect', () => { console.error('-> db reconnected') })

    this.client.on('close', () => { console.error('-> client lost connection') })
    this.client.on('reconnect', () => { console.error('-> client reconnected') })
  }

  update(dataLintos, dataLog) {
    let lastModified = new Date(Date.now())
    dataLintos.lastModified = lastModified
    try {
      this.clientDb.collection(process.env.MONGO_COLLECTION_LINTOS).updateOne({
        sn: dataLintos.serialNumber
      }, {
          $set: dataLintos
        }).then(function (result) {
          debug('Update ' + dataLintos.serialNumber + ' done :', result.result.nModified)
        })

      this.clientDb.collection(process.env.MONGO_COLLECTION_LOG).insertOne({
        sn: dataLog.serialNumber,
        connexion: dataLog.status,
        date: lastModified
      }).then(function (result) {
        debug('Added ' + dataLog.serialNumber + ' logs :', result.result.n)
      })
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = MongoController