# Local
Authentication module using an username and password. This authentication method is based on JWTs (Json Web Tokens)

## Login
Used to collect information when authentication is successful (authentication Token, refresh Token and mqtt information of the current stack).

**URL** : `/:LINTO_STACK_OVERWATCH_BASE_PATH/local/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**
```json
{
    "username": "[valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**
```json
{
    "username": "user@linto.ai",
    "password": "abcd1234"
}
```

### Success Response

**Code** : `202 Accepted`

**Body Content**
```json
{
  "user": {
    "auth_token": "YYYYYYYYYYYYYYYYYYYYYYYYYYY",
    "refresh_token": "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "expiration_date": 1597502813,
    "session_id": "5ee881b36915343d3dz16b13"
  },
  "mqtt": {
    "mqtt_host": "localhost",
    "mqtt_port": "1883",
    "mqtt_use_login": true,
    "mqtt_password": "password",
    "mqtt_login": "user"
  }
}
```

### Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `401 Unauthorized`

**Body Content** :
```
Unauthorized
```

## Scopes
Used to collect scopes for a registered User.

**URL** : `/:LINTO_STACK_OVERWATCH_BASE_PATH/local/scopes/`

**Method** : `GET`

**Auth required** : YES

**Data header constraints**

```
Authorization : Token auth_user_token
```
**Data header example**
```
Authorization : Token XXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Success Response

**Code** : `200 OK`

**Body Content**
```json
[
  {
    "topic": "blk",
    "name": "Default",
    "description": "Default scope"
  },
  {
    "topic": "test",
    "name": "Scopes test",
    "description": "A small description of the scope"
  }
]
```

### Error Response
#### Missing token
**Condition** : When token is missing

**Code** : `401 Unauthorized`

**Body Content** :

```json
{
  "message": "No authorization token was found"
}
```

#### Token invalid
**Condition** : If invalid token is send

**Code** : `401 Unauthorized`

**Body Content** :
```json
{
  "message": "Unexpected token x in JSON at position x"
}
```
#### Token expired
**Condition** : If token is expired

**Code** : `401 Unauthorized`

**Body Content** :
```json
{
  "message": "invalid exp value"
}
```
