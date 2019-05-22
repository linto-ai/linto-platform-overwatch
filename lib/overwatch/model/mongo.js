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
const MongoClient = require('mongodb').MongoClient

let client

class MongoController {
  constructor() {
    let urlMongo = 'mongodb://'
    if (process.env.MONGO_USER)
      urlMongo += process.env.MONGO_USER + ':' + process.env.MONGO_PSW + '@'
    urlMongo += process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/'
    if (process.env.MONGO_USER)
      urlMongo += '?authSource=' + process.env.MONGO_DB_NAME
      
    client = new MongoClient(urlMongo, {
      useNewUrlParser: true
    });
    return this
  }

  update(dataDb, dataLog) {
    client.connect(function (err) {
      try {
        let lastModified = new Date(Date.now())
        dataDb.lastModified = lastModified

        const collection = client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_COLLECTION_LINTO)
        collection.updateOne({
          sn: dataDb.serialNumber
        }, {
            $set: dataDb
          })
          .then(function (result) {
            debug('Update ' + dataDb.serialNumber + ' done : ', result.result.nModified)
          })

        const collectionLog = client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_COLLECTION_LOG)
        collectionLog.insertOne({
          sn: dataLog.serialNumber,
          connexion: dataLog.status,
          date: lastModified
        })
          .then(function (result) {
            debug('Added ' + dataLog.serialNumber + ' logs ', result.result.nModified)
          }).then(() => {client.close()})
      } catch (e) {
        console.error(e)
      }
    })
  }
}

module.exports = MongoController