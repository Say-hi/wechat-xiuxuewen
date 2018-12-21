// 获取全局应用程序实例对象
const app = getApp()
const COS = require('./cos-js-sdk-v5.min')
const config = require('./config')
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
    compressd: true,
    tipsArr: [
      {
        t: 'asdf'
      },
      {
        t: '啊撒旦看风景'
      }
    ],
    testImg: app.data.testImg,
    upImgArr: [],
    upImgArrProgress: [],
    content: 0
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

  compress () {
    this.setData({
      compressd: !this.data.compressd
    })
  },
  upVideo () {
    let that = this
    this.setData({
      speed: null,
      upText: '等待上传',
      size: 0,
      duration: 0,
      time: '等待上传任务结束'
    })
    let start = new Date().getTime()
    wx.chooseVideo({
      compressed: that.data.compressd,
      success (res) {
        console.log('chooseSuccess', res)
        that.setData({
          duration: res.duration,
          size: res.size / 1024 > 1024 ? res.size / 1024 / 1024 + 'M' : res.size / 1024 + 'KB'
        })
        let v = res.tempFilePath
        let Key = `video/10000/${v.substr(v.lastIndexOf('/') + 1)}`
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key,
          FilePath: v,
          onProgress: function (info) {
            that.setData({
              upText: '上传中',
              speed: info.speed / 1024 > 1024 ? info.speed / 1024 / 1024 + 'M/s' : info.speed / 1024 + 'KB/s'
            })
          }
        }, (err, data) => {
          that.setData({
            time: (new Date().getTime() - start) / 1000
          })
          if (err) {
            console.error('upLoadErr', err)
            that.setData({
              upText: '失败'
            })
          } else {
            console.log('data', data)
            that.setData({
              upText: '成功'
            })
          }
        })
      }
    })
  },
  // 图片操作
  imgOperation (e) {
    if (!this.data.upImgArr[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr[e.currentTarget.dataset.index].temp, [that.data.upImgArr[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr[e.currentTarget.dataset.index].Key
          }, () => {
            that.data.upImgArr.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              upImgArr: that.data.upImgArr
            })
          })
        } else if (res.tapIndex === 1) {
          that.wxUploadImg(e.currentTarget.dataset.index)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    })
    app.setBar(options.type || '发布问题')
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
