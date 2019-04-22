/**
 * Created by JWQ on 2019/2/20.
 */
wx.cloud.init({
  traceUser: true
})

module.exports = {
  getShareText () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getShareText',
        data: {},
        success (res) {
          resolve(res)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getUserOperation () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getUserOperation',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  getMoney () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getMoney',
        data: {},
        success (res) {
          resolve(res.result)
        },
        fail (err) {
          reject(err)
        }
      })
    })
  }
}
