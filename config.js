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

require('dotenv').config()
const debug = require('debug')('linto-overwatch:config')
const dotenv = require('dotenv')
const fs = require('fs')


function ifHasNotThrow(element, error) {
	if (!element) throw error
	return element
}
function ifHas(element, defaultValue) {
	if (!element) return defaultValue
	return element
}


function configureDefaults() {
	try {
		const envdefault = dotenv.parse(fs.readFileSync('.envdefault'))
		//MQTT Configuration
		process.env.MQTT_HOST = ifHas(process.env.MQTT_HOST, envdefault.MQTT_HOST)
		process.env.MQTT_PORT = ifHas(process.env.MQTT_PORT, envdefault.MQTT_PORT)
		process.env.MQTT_USER = ifHas(process.env.MQTT_USER, envdefault.MQTT_USER)
		process.env.MQTT_PSW = ifHas(process.env.MQTT_PSW, envdefault.MQTT_PSW)
		process.env.MQTT_KEEP_ALIVE = ifHas(process.env.MQTT_KEEP_ALIVE, envdefault.MQTT_KEEP_ALIVE)

		//Mongo Configuration
		process.env.MONGO_HOST = ifHas(process.env.MONGO_HOST, envdefault.MONGO_HOST)
		process.env.MONGO_PORT = ifHas(process.env.MONGO_PORT, envdefault.MONGO_PORT)
		process.env.MONGO_DB_NAME = ifHas(process.env.MONGO_DB_NAME, envdefault.MONGO_DB_NAME)

		process.env.MONGO_USER = ifHas(process.env.MONGO_USER, envdefault.MONGO_USER)
		process.env.MONGO_PSW = ifHas(process.env.MONGO_PSW, envdefault.MONGO_PSW)

	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}
module.exports = configureDefaults()