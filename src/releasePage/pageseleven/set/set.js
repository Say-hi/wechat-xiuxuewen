// 获取全局应用程序实例对象
const app = getApp()
const COS = require('../cos-js-sdk-v5.min')
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
    upImgArr: [],
    upImgArrProgress: []
  },
  shopUserReal () {
    let that = this
    let temp = []
    if (that.data.options.type !== 'user') {
      for (let v of that.data.upImgArr) {
        if (!v.real) return app.setToast(that, {content: '请等待图片上传完成'})
        temp.push(v.real)
      }
    }
    app.wxrequest({
      url: app.getUrl()[that.data.options.type === 'user' ? 'shopUserReal' : 'shopSet'],
      data: that.data.options.type === 'user' ? {
        uid: app.gs('userInfoAll').id,
        mall_rname: that.data.username
      } : {
        mid: app.gs('shopInfoAll').id || 10001,
        name: that.data.username,
        ad: temp.join(','),
        avatar: that.data.avatar
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          let info = {}
          if (that.data.options.type === 'user') {
            info = app.gs('userInfoAll')
            info.mall_rname = that.data.username
            app.su('userInfoAll', info)
          } else {
            info.avatar = that.data.avatar
            info.name = that.data.username
            app.su('shopInfoAll', info)
          }
          wx.showToast({
            title: '修改完成',
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1400)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  inputName (e) {
    if (e.detail.value.length <= 0) return app.setToast(this, {content: '请输入内容'})
    this.setData({
      username: e.detail.value
    })
  },
  change () {
    let that = this
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: 1,
      success (res) {
        that.data.avatar = ''
        that.data.percent = 0
        let v = res.tempFilePaths[0]
        let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: v,
          onProgress: function (info) {
            that.setData({
              percent: info.percent * 100
            })
          }
        }, (err) => {
          if (err) {
            wx.showModal({
              title: '上传失败',
              content: '请重新上传图片'
            })
          } else {
            that.setData({
              avatar: `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
            }, () => {
              that.shopUserReal(that.data.username)
            })
          }
        })
      }
    })
  },
  wxUploadImg (index = -1) {
    let that = this
    let length = that.data.upImgArr.length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 3 - length,
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
              that.data.upImgArr[index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr: that.data.upImgArr
              })
            } else {
              that.data.upImgArr[index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data.upImgArr[index >= 0 ? index : length + j]['Key'] = Key
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
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
  onShareAppMessage () {
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: `/pages/index/index`,
        imageUrl: app.gs('shareText').g
      }
    } else {
      return {
        title: `向您推荐店铺【${app.gs('shopInfoAll').name}】`,
        imageUrl: `${app.gs('shopInfoAll').avatar || ''}`,
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}&user=${app.gs('userInfoAll').id}`
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options,
      avatar: app.gs('shopInfoAll').avatar,
      username: options.type === 'user' ? app.gs('userInfoAll').mall_rname : app.gs('shopInfoAll').name
    })
    if (options.type !== 'user') {
      let upImgArr = []
      let upImgArrProgress = []
      for (let v of app.gs('shopInfoAll').ad.split(',')) {
        upImgArr.push({
          temp: v,
          key: v,
          real: v
        })
        upImgArrProgress.push(100)
      }
      this.setData({
        upImgArr,
        upImgArrProgress
      })
    }
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
