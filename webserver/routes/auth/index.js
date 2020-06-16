
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
const debug = require('debug')('linto-overwatch:webserver:auth:basic')

const scopesApi = require(process.cwd() + '/webserver/api/scopes')

module.exports = (webServer, auth) => {
  return [
    {
      name: 'login',
      path: '/login',
      method: 'post',
      controller: [
        auth.authenticate,
        (req, res, next) => {
          let output = scopesApi.formatAuth(req.user)
          res.status(202).json(output)
        }
      ],
    },
    {
      name: 'scopes',
      path: '/scopes',
      method: 'get',
      controller: [
        (auth.isAuthenticate) ? auth.isAuthenticate : auth.authenticate,
        (req, res, next) => {
          let output = scopesApi.getScopesList(req.payload.id)
          res.status(200).json(output)
        }
      ]
    }
  ]
}