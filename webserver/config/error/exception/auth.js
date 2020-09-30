class InvalidCredential extends Error {
  constructor(message) {
    super()
    this.name = 'InvalidCredential'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'Wrong user credential'
  }
}

class MalformedToken extends Error {
  constructor(message) {
    super()
    this.name = 'MalformedToken'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'The token is malformed'
  }
}

class NoSecretFound extends Error {
  constructor(message) {
    super()
    this.name = 'NoSecretFound'
    this.status = '404'
    if (message) this.message = message
    else this.message = 'Secret token is missing'
  }
}

class NoSlotAvailable extends Error {
  constructor(message) {
    super()
    this.name = 'NoSlotAvailable'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'No slot avaiable for the requested website'
  }
}

class UnreservedSlot extends Error {
  constructor(message) {
    super()
    this.name = 'UnreservedSlot'
    this.status = '401'
    if (message) this.message = message
    else this.message = 'No slot has been reserved for these user'
  }
}

module.exports = {
  InvalidCredential,
  MalformedToken,
  NoSecretFound,
  NoSlotAvailable,
  UnreservedSlot
}