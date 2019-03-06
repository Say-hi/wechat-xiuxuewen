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
  data: {},
  shopUserReal (name) {
    let that = this
    app.wxrequest({
      url: app.getUrl()[that.data.options.type === 'user' ? 'shopUserReal' : 'shopSet'],
      data: that.data.options.type === 'user' ? {
        uid: app.gs('userInfoAll').id,
        mall_rname: name
      } : {
        mid: app.gs('shopInfoAll').id,
        name,
        avatar: that.data.avatar
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          let info = {}
          if (that.data.options.type === 'user') {
            info = app.gs('userInfoAll')
            info.mall_rname = name
            app.su('userInfoAll', info)
          } else {
            info.avatar = that.data.avatar
            info.name = name
            app.su('shopInfoAll', info)
          }
          wx.showToast({
            title: '修改完成'
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  inputName (e) {
    if (e.detail.value.length <= 0) return app.setToast(this, {content: '请输入内容'})
    this.shopUserReal(e.detail.value)
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
