const debug = require('debug')('linto-overwatch:overwatch:watcher')
const Mqtt = require('mqtt')

const jwtDecode = require('jwt-decode');

const MongoLogsCollection = require('../mongodb/models/logs')
const MongoLintoCollection = require('../mongodb/models/lintos')
const MongoWebCollection = require('../mongodb/models/webapp_hosts')

const SlotsManager = require('../slotsManager/slotsManager')

class WatcherMqtt {
  constructor() {
    // this.clientMongo = new MongoController()

    this.register = []
    this.subTopic = '#'

    this.configMqtt = {
      clean: true,
      servers: [{
        host: process.env.LINTO_STACK_MQTT_HOST,
        port: process.env.LINTO_STACK_MQTT_PORT
      }],
      keepalive: parseInt(process.env.LINTO_STACK_MQTT_KEEP_ALIVE), //can live for LOCAL_LINTO_STACK_MQTT_KEEP_ALIVE seconds without a single message sent on broker
      reconnectPeriod: Math.floor(Math.random() * 1000) + 1000, // ms for reconnect,
      qos: 2
    }

    if (process.env.LINTO_STACK_MQTT_USE_LOGIN === 'true') {
      this.configMqtt.username = process.env.LINTO_STACK_MQTT_USER
      this.configMqtt.password = process.env.LINTO_STACK_MQTT_PASSWORD
    }

    return this.init()
  }

  async init() {
    return new Promise((resolve, reject) => {
      let cnxError = setTimeout(() => {
        debug('Timeout')
        console.error('Unable to connect to Broker')
        return reject('Unable to connect')
      }, 2000)

      this.client = Mqtt.connect(this.configMqtt)
      this.client.on('error', e => {
        console.error('broker error : ' + e)
      })

      this.client.on('connect', () => {
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

      this.client.once('connect', () => {
        clearTimeout(cnxError)
        this.client.on('offline', () => {
          console.error('broker connexion down')
        })
        resolve(this)
      })

      this.client.on('message', async (topic, payload) => {
        try {
          const _subTopics = topic.split('/')
          const [_clientCode, _channel, _sn, _etat, _type, _id] = _subTopics
          switch (_etat) {
            case 'status':
              if (_sn.indexOf(process.env.LINTO_STACK_OVERWATCH_WEB_TOPIC_KEY) !== -1) {
                const jsonPayload = JSON.parse(payload)
                if (jsonPayload.connexion === "online" && jsonPayload.auth_token !== undefined) {
                  MongoWebCollection.takeSlot(jwtDecode(jsonPayload.auth_token.split('WebApplication')[1]), _sn)
                } else if (jsonPayload.connexion === "offline") {
                  SlotsManager.removeSlot(_sn)
                }
              } else {  // Static or Android
                const jsonPayload = JSON.parse(payload)
                const lastModified = new Date(Date.now())

                // Lintos BDD update on mqtt message
                let dataLinto = {
                  sn: _sn,
                  connexion: jsonPayload.connexion,
                }
                jsonPayload.connexion === 'offline' ? dataLinto.last_down = lastModified : dataLinto.last_up = lastModified
                MongoLintoCollection.updateLinto(dataLinto)

                // Overwatch Logs data
                let dataLog = {
                  sn: _sn,
                  status: jsonPayload.connexion,
                  date: lastModified
                }

                if (process.env.LINTO_STACK_OVERWATCH_LOG_MONGODB === 'true')
                  MongoLogsCollection.insertLog(dataLog)

              }

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