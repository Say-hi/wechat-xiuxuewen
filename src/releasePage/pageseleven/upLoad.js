/**
 * Created by kkk on 2019/3/11.
 */
const app = getApp()
const config = require('./config')
const COS = require('./cos-js-sdk-v5.min')
const cos = new COS({
  getAuthorization (params, callback) {
    let authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    })
    callback(authorization)
  }
})
class upLoad {
  constructor (param) {
    this.count = param['count'] || 9
    this._that = param['this'] || getCurrentPages()[getCurrentPages().length - 1]
    this.imgArr = param['imgArr'] || 0
    this.fileIndex = param['index'] * 1 + 1 > 0 ? param['index'] : -1
    this.tempFilpaths = []
    this.itemList = param['itemList'] || ['查看图片', '替换图片', '删除图片']
  }
  imgOp () {
    if (!this.checkAll()) return
    let that = this
    wx.showActionSheet({
      itemList: that.itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that._that.data['info']['sku'][that.imgArr]['img'][that.fileIndex].real, [that._that.data['info']['sku'][that.imgArr]['img'][that.fileIndex].real])
        } else if (res.tapIndex === 1) {
          that.chooseImage()
        } else if (res.tapIndex === 2) {
          let temp = that._that.data['info']['sku'][that.imgArr]['img']
          temp.splice(that.fileIndex, 1)
          that._that.setData({
            [`info.sku[${that.imgArr}].img`]: temp
          })
        }
      }
    })
  }
  checkAll () {
    let status = true
    if (this._that.data['info']['sku'][this.imgArr]['img']) {
      for (let v of this._that.data['info']['sku'][this.imgArr]['img']) {
        if (v.progress < 99) status = false
      }
    }
    if (!status) app.setToast(this._that, {content: '请等待图片上传完成'})
    return status
  }
  chooseImage () {
    let that = this
    if (!this.checkAll()) return
    wx.showLoading()
    wx.chooseImage({
      count: that.fileIndex > -1 ? 1 : that.count - (that._that.data['info']['sku'][that.imgArr]['img'] ? that._that.data['info']['sku'][that.imgArr]['img'].length : 0),
      success (res) {
        wx.hideLoading()
        that.tempFilpaths = res.tempFilePaths
        let temp = []
        for (let v of res.tempFilePaths) {
          temp.push({
            temp: v,
            real: '',
            key: '',
            progress: 0
          })
        }
        if (that.fileIndex > -1) {
          that._that.setData({
            [`info.sku[${that.imgArr}].img[${that.fileIndex}]`]: {
              temp: res.tempFilePaths[0],
              real: '',
              key: '',
              progress: 0
            }
          }, () => {
            that.upLoad()
          })
        } else {
          that._that.setData({
            [`info.sku[${that.imgArr}].img`]: that._that.data['info']['sku'][that.imgArr]['img'] ? that._that.data['info']['sku'][that.imgArr]['img'].concat(temp) : temp
          }, () => {
            that.upLoad()
          })
        }
      },
      fail (err) {
        wx.hideLoading()
        console.log(err)
      }
    })
  }
  upLoad (i = 0) {
    if (!this.tempFilpaths[i]) return
    let that = this
    let FilePath = this.tempFilpaths[i]
    let Key = `image/${app.gs('userInfoAll').id || 10000}/${FilePath.substr(FilePath.lastIndexOf('/') + 1)}`
    cos.postObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key,
      FilePath,
      onProgress (info) {
        that._that.setData({
          [`info.sku[${that.imgArr}].img[${that.fileIndex > -1 ? that.fileIndex : that._that.data['info']['sku'][that.imgArr]['img'].length - that.tempFilpaths.length + i}].progress`]: info.percent * 100
        })
      }
    }, (err, data) => {
      if (err) {
        that._that.setData({
          [`info.sku[${that.imgArr}].img[${that.fileIndex > -1 ? that.fileIndex : that._that.data['info']['sku'][that.imgArr]['img'].length - that.tempFilpaths.length + i}].progress`]: false
        }, () => {
          that.upLoad(++i)
        })
      } else {
        that._that.setData({
          [`info.sku[${that.imgArr}].img[${that.fileIndex > -1 ? that.fileIndex : that._that.data['info']['sku'][that.imgArr]['img'].length - that.tempFilpaths.length + i}]`]: {
            real: `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`,
            key: Key,
            temp: FilePath,
            progress: 100
          }
        }, () => {
          that.upLoad(++i)
        })
      }
    })
  }
}

module.exports = upLoad
