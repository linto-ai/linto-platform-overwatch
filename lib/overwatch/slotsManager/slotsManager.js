let slots = {}

module.exports = {
  takeSlot: (sn, data) => slots[sn] = data,
  removeSlot: (sn) => {
    if (slots[sn])
      delete slots[sn]
  },
  countSlotsApplication: (appId) => {
    let count = 0
    Object.keys(slots).forEach(key => {
      if (slots[key].applicationId === appId) count++
    })
    return count
  },
  getSn: (sn) => slots[sn],
  get: () => slots,
}
