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
const collectionNameLintos = 'lintos'
const collectionNameStatusLog = 'statusLog'

let client

class MongoController {
  constructor() {
    let urlMongo = 'mongodb://'
    if (process.env.MONGO_USER)
      urlMongo += process.env.MONGO_USER + ':' + process.env.MONGO_PSW + '@'
    urlMongo += process.env.MONGO_HOST + ':' + process.env.MONGO_PORT+'/'
    if (process.env.MONGO_USER)
      urlMongo += '?authSource=' + process.env.MONGO_DB_NAME
    client = new MongoClient(urlMongo);
    return this
  }

  updateLintoCollection(data) {
    client.connect(function (err) {
      try {
        const collection = client.db(process.env.MONGO_DB_NAME).collection(collectionNameLintos);
        collection.updateOne({
            sn: data.serialNumber
          }, {
            $set: {
              connexion: data.status,
              lastModified: data.lastModified
            }
          })
          .then(function (result) {
            debug('Update ' + data.serialNumber + ' done : ', result.result.nModified)
          })
      } catch (e) {
        console.error(e)
      }
    })
    client.close()
  }

  insertStatusLog(data) {
    client.connect(function (err) {
      try {
        const collection = client.db(process.env.MONGO_DB_NAME).collection(collectionNameStatusLog);
        collection.insertOne({
            sn: data.serialNumber,
            connexion: data.status,
            date: data.lastModified
          })
          .then(function (result) {
            debug('Added ' + data.serialNumber + ' logs ', result.result.nModified)
          })
      } catch (e) {
        console.error(e)
      }
    })
    client.close()
  }

  update(data) {
    data.lastModified = new Date(Date.now())
    this.updateLintoCollection(data)
    this.insertStatusLog(data)
  }
}

module.exports = MongoController