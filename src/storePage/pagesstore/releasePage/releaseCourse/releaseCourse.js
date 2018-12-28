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
    courseArr: ['视频课程', '免费线下课程', '驻店课程'],
    labelArr: ['绣眉', '眼线', '纹唇', '其他'],
    courseIndex: 0,
    labelIndex: 0,
    videoUrl: null,
    upImgArr: [],
    upImgArrProgress: [],
    upImgArr2: [],
    upImgArrProgress2: [],
    upImgArr3: [],
    upImgArrProgress3: [],
    upImgArr4: [],
    upImgArrProgress4: [],
    startDay: app.momentFormat(new Date(), 'YYYY/MM/DD'),
    startDay2: app.momentFormat(app.momentAdd(1, 'd'), 'YYYY/MM/DD'),
    endDay: app.momentFormat(app.momentAdd(3, 'M'), 'YYYY/MM/DD')
  },
  chooseF (e) {
    if (e.currentTarget.dataset.type === 'course') {
      this.setData({
        courseIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        labelIndex: e.currentTarget.dataset.index
      })
    }
  },

  upVideo () {
    if (this.data.upText === '上传中' || this.data.upText === '等待上传') return
    let that = this
    this.setData({
      speed: '0KB/s',
      upText: '等待上传',
      size: 0,
      duration: 0
    })
    let start = new Date().getTime()
    wx.chooseVideo({
      compressed: that.data.compressd,
      success (res) {
        that.setData({
          duration: res.duration,
          videoUrl: res.tempFilePath,
          size: res.size / 1024 > 1024 ? res.size / 1024 / 1024 + 'M' : res.size / 1024 + 'KB'
        })
        let v = res.tempFilePath
        let Key = `video/10000/${v.substr(v.lastIndexOf('/') + 1)}`
        console.log(cos)
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key,
          FilePath: v,
          onProgress: function (info) {
            that.setData({
              percent: info.percent * 100,
              upText: '上传中',
              speed: info.speed / 1024 > 1024 ? (info.speed / 1024 / 1024).toFixed(2) + 'M/s' : (info.speed / 1024).toFixed(2) + 'KB/s'
            })
          }
        }, (err, data) => {
          that.data.time = (new Date().getTime() - start) / 1000
          if (err) {
            console.error('upLoadErr', err)
            that.setData({
              upText: '失败,请上传不超过100M大小的MP4格式视频'
            })
          } else {
            console.log('data', data)
            that.setData({
              upText: '成功',
              videoUlrR: `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
            })
          }
        })
      }
    })
  },

  upImg (e, index) {
    let imgArr, progressArr
    if (e.currentTarget.dataset.type === 'detail') {
      imgArr = 'upImgArr2'
      progressArr = 'upImgArrProgress2'
    } else {
      imgArr = 'upImgArr'
      progressArr = 'upImgArrProgress'
    }
    if (this.data[imgArr].length > 0) {
      if (this.data[imgArr][0].real) {
        index = 0
      } else {
        return
      }
    }
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
        if (e.currentTarget.dataset.type === 'detail') {
          that.setData({
            upImgArr2: that.data[imgArr]
          })
        } else {
          that.setData({
            upImgArr: that.data[imgArr]
          })
        }
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
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArrProgress2: that.data[progressArr]
                })
              } else {
                that.setData({
                  upImgArrProgress: that.data[progressArr]
                })
              }
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArr2: that.data[imgArr]
                })
              } else {
                that.setData({
                  upImgArr: that.data[imgArr]
                })
              }
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArr2: that.data[imgArr]
                })
              } else {
                that.setData({
                  upImgArr: that.data[imgArr]
                })
              }
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },

  bindDateChange (e) {
    if (e.currentTarget.dataset.type === 'start') {
      this.setData({
        userChooseStart: app.momentFormat(e.detail.value, 'YYYY/MM/DD'),
        startDay2: app.momentFormat(app.momentAdd(1, 'd', e.detail.value), 'YYYY/MM/DD'),
        userChooseEnd: app.momentFormat(app.momentAdd(1, 'd', e.detail.value), 'YYYY/MM/DD'),
        endDay: app.momentFormat(app.momentAdd(3, 'M', e.detail.value), 'YYYY/MM/DD')
      })
    } else {
      this.setData({
        userChooseEnd: e.detail.value
      })
    }
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
  goRelease () {
    let type = this.data.courseIndex === 0 ? 1 : this.data.courseIndex === 1 ? 2 : 4
    wx.navigateTo({
      url: `../../coursePage/courseDetail2/courseDetail?type=${type}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('发布课程')
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
    // TODO: onHide
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
