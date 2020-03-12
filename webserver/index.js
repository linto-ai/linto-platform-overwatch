/*
 * Copyright (c) 2018 Linagora.
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
'use strict'

const debug = require('debug')('linto-overwatch:webserver')
const express = require('express')
const bodyParser = require('body-parser')
const EventEmitter = require('eventemitter3')
const passport = require('passport')

class WebServer extends EventEmitter {
  constructor() {
    super()
    this.app = express()
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())

    require('./routes')(this)
    this.app.use('/', express.static('public'))

    this.app.use(passport.initialize())
    this.app.use(passport.session())  // Optional

    return this.init()
  }

  async init() {
    this.app.listen(process.env.LINTO_STACK_OVERWATCH_HTTP_PORT, function () {
      debug(`Express launch on ${process.env.LINTO_STACK_OVERWATCH_HTTP_PORT}`)
    })
    return this
  }
}
module.exports = new WebServer()
