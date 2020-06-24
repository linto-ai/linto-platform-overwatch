# Default
The default overwatch API, that allow to get basic information of the service running, authentication methods running, ...

## Healths
Check if the service is running

**URL** : `/:LINTO_STACK_OVERWATCH_BASE_PATH/health`

**Method** : `GET`

**Auth required** : NO

### Success Response

**Code** : `200 OK`

**Body Content**
```
OK
```

## Authentication methods
Give the server authentication methode enable

**URL** : `/:LINTO_STACK_OVERWATCH_BASE_PATH/auths`

**Method** : `GET`

**Auth required** : NO

### Success Response

**Code** : `200 OK`

**Body Content**
```json
[
  {
    "type": "local",
    "basePath": "/local"
  },
  {
    "type": "ldap",
    "basePath": "/ldap"
  }
]
```