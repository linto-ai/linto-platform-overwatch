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
    else this.message = 'No slot avaiable at the moment'
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
  NoSecretFound,
  NoSlotAvailable,
  UnreservedSlot
}