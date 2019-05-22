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

const debug = require('debug')('linto-overwatch:overwatch:watcher')
const Mqtt = require('mqtt')
const MongoController = require('../model/mongo')

class WatcherMqtt {
  constructor() {
    this.clientMongo = new MongoController()

    this.register = []
    //TODO define hub
    this.subTopic = '#'

    this.configMqtt = {
      clean: true,
      servers: [{
        host: process.env.MQTT_HOST,
        port: process.env.MQTT_PORT
      }],
      keepalive: parseInt(process.env.MQTT_KEEP_ALIVE), //can live for LOCAL_MQTT_KEEP_ALIVE seconds without a single message sent on broker
      reconnectPeriod: Math.floor(Math.random() * 1000) + 1000, // ms for reconnect,
      qos: 2
    }

    if (process.env.MQTT_USER) {
      this.configMqtt.username = process.env.MQTT_USER
      this.configMqtt.password = process.env.MQTT_PSW
    }
    return this.init()
  }

  async init() {
    return new Promise((resolve, reject) => {
      let cnxError = setTimeout(() => {
        debug('Timeout')
        return reject("Unable to connect");
      }, 2000)

      this.client = Mqtt.connect(this.configMqtt)
      this.client.on("error", e => {
        console.error("broker error : " + e)
      })

      this.client.on("connect", () => {
        //clear any previous subsciptions
        this.client.unsubscribe(this.subTopic, (err) => {
          if (err) debug('disconnecting while unsubscribing', err)
          //Subscribe to the client topics
          debug(`subscribing topics...`)
          this.client.subscribe(this.subTopic, (err) => {
            if (!err) {
              debug(`subscribed successfully to ${this.subTopic}`)
            } else {
              console.error(err)
            }
          })
        })
      })

      this.client.once("connect", () => {
        clearTimeout(cnxError)
        this.client.on("offline", () => {
          debug("broker connexion down")
        })
        resolve(this)
      })

      this.client.on('message', async (topic, payload) => {
        try {
          const _subTopics = topic.split("/");
          const [_clientCode, _channel, _sn, _etat, _type, _id] = _subTopics;
          debug(_subTopics)
          switch (_etat) {
            case 'status':
              let data = {
                'clientCode': _clientCode,
                'serialNumber': _sn,
                'status': JSON.parse(payload).connexion
              }
              let jsonPayload = JSON.parse(payload)
              jsonPayload.serialNumber = _sn
              this.clientMongo.update(jsonPayload, data)
              break
            default:
              console.error('No data to store message')
              break
          }
        } catch (err) {
          console.error(err)
        }
      })
    })
  }

}

module.exports = WatcherMqtt