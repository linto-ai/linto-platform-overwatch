const jwtDecode = require('jwt-decode');

let slots = {}

let self = module.exports = {
  get: () => slots,
  getSn: (sn) => slots[sn],
  getSnByToken: (sn, token) => {
    let decodedToken = jwtDecode(token.split('WebApplication')[1])
    if (decodedToken && decodedToken.data && decodedToken.data.sessionId === sn)
      return self.getSn(decodedToken.data.sessionId )
    return undefined
  },
  takeSlot: (sn, data) => slots[sn] = data,
  takeSlotIfAvailable: (sn, app, originUrl) => {
    if (app.maxSlots > self.countSlotsApplication(app.applicationId)) {
      return self.takeSlot(sn, { originUrl, applicationId: app.applicationId })
    } else return undefined
  },
  countSlotsApplication: (appId) => {
    let count = 0
    Object.keys(slots).forEach(key => {
      if (slots[key].applicationId === appId) count++
    })
    return count
  },
  removeSlot: (sn) => {
    if (slots[sn])
      delete slots[sn]
  }
}
