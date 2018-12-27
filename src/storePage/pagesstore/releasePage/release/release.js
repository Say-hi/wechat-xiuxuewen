// 获取全局应用程序实例对象
const app = getApp()
const COS = require('../cos-js-sdk-v5.min.js')
const config = require('../config')
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
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userAddress: {
      address: '选择地址定位'
    },
    openType: '',
    tipsArr: [
      {
        t: 'asdf'
      },
      {
        t: '啊撒旦看风景'
      }
    ],
    labelIndex: -1,
    labelArr: ['富力天域', '十年纹绣', 'ID品牌'],
    testImg: app.data.testImg,
    upImgArr: [],
    upImgArrProgress: [],
    upImgArr3: [],
    upImgArrProgress3: [],
    upImgArr4: [],
    upImgArrProgress4: [],
    content: 0
  },
  // 多图上传
  upImg2 (index) {
    let imgArr = 'upImgArr3'
    let progressArr = 'upImgArrProgress3'
    let that = this
    let length = that.data[imgArr].length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data[imgArr][index >= 0 ? index : length + i]) {
            that.data[imgArr][index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data[imgArr][index >= 0 ? index : length + i]['real'] = ''
          that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr3: that.data[imgArr]
        })
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data[imgArr][index].Key
          })
        }
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress3: that.data[progressArr]
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr3: that.data[imgArr]
              })
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr3: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  // 图片操作
  imgOperation (e) {
    if (!this.data.upImgArr3[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr3) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr3[e.currentTarget.dataset.index].temp, [that.data.upImgArr3[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr3[e.currentTarget.dataset.index].Key
          }, () => {
            that.data.upImgArr3.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              upImgArr3: that.data.upImgArr3
            })
          })
        } else if (res.tapIndex === 1) {
          that.upImg2(e.currentTarget.dataset.index)
        }
      }
    })
  },
  // 多图上传
  upImg3 (index) {
    let imgArr = 'upImgArr4'
    let progressArr = 'upImgArrProgress4'
    let that = this
    let length = that.data[imgArr].length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data[imgArr][index >= 0 ? index : length + i]) {
            that.data[imgArr][index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data[imgArr][index >= 0 ? index : length + i]['real'] = ''
          that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr4: that.data[imgArr]
        })
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data[imgArr][index].Key
          })
        }
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress4: that.data[progressArr]
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr4: that.data[imgArr]
              })
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr4: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  // 图片操作
  imgOperation2 (e) {
    if (!this.data.upImgArr4[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr4) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr4[e.currentTarget.dataset.index].temp, [that.data.upImgArr4[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr4[e.currentTarget.dataset.index].Key
          }, () => {
            that.data.upImgArr4.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              upImgArr4: that.data.upImgArr4
            })
          })
        } else if (res.tapIndex === 1) {
          that.upImg3(e.currentTarget.dataset.index)
        }
      }
    })
  },
  upno () {
    app.setToast(this, {content: '图片上传中，请稍后操作'})
  },
  // 选择地址
  address () {
    let that = this
    wx.getSetting({
      success (res) {
        // 用户未授权
        if (!res.authSetting['scope.userLocation']) {
          wx.chooseLocation({
            success (res) {
              that.setData({
                openType: null,
                userAddress: res
              })
            },
            fail () {
              that.setData({
                openType: 'openSetting'
              })
            }
          })
        } else {
          // 用户已授权
          that.setData({
            openType: null
          })
          wx.chooseLocation({
            success (res) {
              that.setData({
                openType: null,
                userAddress: res
              })
            }
          })
        }
      }
    })
  },
  // 获取设置
  opensetting (e) {
    if (!e.detail.authSetting['scope.userLocation']) {
      this.setData({
        openType: 'openSetting'
      })
    } else {
      this.setData({
        openType: null
      })
    }
  },
  inputValue (e) {
    this.setData({
      content: e.detail.value
    })
  },
  chooseTip (e) {
    this.data.tipsArr[e.currentTarget.dataset.index]['choose'] = !this.data.tipsArr[e.currentTarget.dataset.index]['choose']
    this.setData({
      tipsArr: this.data.tipsArr
    })
  },
  // 上传图片
  wxUploadImg (index = -1) {
    let that = this
    let length = that.data.upImgArr.length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data.upImgArr[index >= 0 ? index : length + i]) {
            that.data.upImgArr[index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data.upImgArr[index >= 0 ? index : length + i]['real'] = ''
          that.data.upImgArr[index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr: that.data.upImgArr
        })
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr[index].Key
          })
        }
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data.upImgArrProgress[index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress: that.data.upImgArrProgress
              })
            }
          }, (err, data) => {
            if (err) {
              console.error('upLoadErr', err)
              that.data.upImgArr[index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr: that.data.upImgArr
              })
            } else {
              console.log(data)
              that.data.upImgArr[index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data.upImgArr[index >= 0 ? index : length + j]['Key'] = Key
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },

  goRelease () {
    wx.navigateTo({
      url: '../coursePage/courseDetail/courseDetail?type=3'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    })
    app.setBar(options.type || '教室信息设置')
    // TODO: onLoad
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
