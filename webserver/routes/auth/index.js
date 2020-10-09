
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
const debug = require('debug')('linto-overwatch:webserver:auth')

const WorkflowApplication = require(process.cwd() + '/webserver/lib/workflowApplication')
const User = require(process.cwd() + '/webserver/lib/user')
const authWrapper = require(process.cwd() + '/webserver/lib/authWrapper')

module.exports = (webServer, auth) => {
  return [
    {
      name: 'login',
      path: '/android/login',
      method: 'post',
      controller: [
        auth.authenticate_android,
        (req, res, next) => {
          let output = authWrapper.formatAuthAndroid(req.user)
          res.status(202).json(output)
        }
      ],
    },
    {
      name: 'logout',
      path: '/android/logout',
      method: 'get',
      controller: [
        (auth.isAuthenticate) ? auth.isAuthenticate : undefined,
        (req, res, next) => {
          User.logout(req.payload.data)
          res.status(200).send('Ok')
        }
      ]
    },
    {
      name: 'login',
      path: '/web/login',
      method: 'post',
      controller: [
        (req, res, next) => {
          if (req.headers.origin) {
            req.body.originurl = extractHostname(req.headers.origin)
            next()
          } else res.status(400).json('Origin headers is require')
        },
        auth.authenticate_web,
        (req, res, next) => {
          let output = authWrapper.formatAuthWeb(req.user)
          res.status(202).json(output)
        }
      ],
    },
    {
      name: 'isAuth',
      path: '/isAuth',
      method: 'get',
      controller: [
        (auth.isAuthenticate) ? auth.isAuthenticate : undefined,
        (req, res, next) => {
          res.status(200).send('Ok')
        }
      ]
    },
    {
      name: 'scopes',
      path: '/scopes',
      method: 'get',
      controller: [
        (auth.isAuthenticate) ? auth.isAuthenticate : undefined,
        (req, res, next) => {
          WorkflowApplication.getWorkflowApp(req.payload.data)
            .then(scopes => res.status(200).json(scopes))
            .catch(err => res.status(500).send('Can\'t retrieve scope'))
        }
      ]
    }
  ]
}

function extractHostname(url) {
  let hostname

  if (url.indexOf("//") > -1) hostname = url.split('/')[2]
  else hostname = url.split('/')[0]

  hostname = hostname.split(':')[0].split('?')[0]
  return hostname
}