// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.baseDomain,
    painting: {},
    sid: '',
    color: '#0094ff',
    shareImage: ''
  },
  eventDraw (e) {
    wx.showLoading({
      title: '定制专属海报中',
      mask: true
    })
    let that = this
    this.setData({
      painting: {
        width: 375,
        height: 603,
        clear: true,
        views: [
          {
            type: 'image',
            url: app.gs('userInfoAll').avatar_url,
            top: 30,
            left: 30,
            width: 70,
            height: 70
          },
          {
            type: 'image',
            url: `${that.data.qrCode}`,
            top: 232,
            left: 115,
            width: 160,
            height: 160
          },
          {
            type: 'image',
            url: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/share/shop.png',
            top: 0,
            left: 0,
            width: 375,
            height: 603
          },
          {
            type: 'text',
            content: `【${app.gs('shopInfoAll').name}】`,
            top: 55,
            left: 105,
            width: 500
          }
        ]
      }
    })
  },
  eventDraw2 (e) {
    wx.showLoading({
      title: '定制海报中',
      mask: true
    })
    let that = this
    let views = [
      {
        type: 'image',
        url: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/no_del_img/detailshare.png',
        top: 0,
        left: 0,
        width: 375,
        height: 603
      },
      {
        type: 'image',
        url: app.data.shareimgurl,
        top: 120,
        left: 36,
        width: 300,
        height: 220
      },
      {
        type: 'text',
        content: app.data.sharename,
        breakWord: true,
        MaxLineNumber: 2,
        fontSize: 20,
        lineHeight: 20,
        top: 360,
        left: 40,
        width: 120,
        color: 'black'
      },
      {
        type: 'text',
        content: '售价：' + app.data.sharemoney,
        breakWord: true,
        MaxLineNumber: 2,
        top: 420,
        left: 40,
        width: 120,
        color: 'black'
      },
      {
        type: 'image',
        url: `${that.data.qrCode}`,
        top: 358,
        left: 198,
        width: 130,
        height: 130
      }
    ]

    this.setData({
      painting: {
        width: 375,
        height: 603,
        clear: true,
        views
      }
    })
  },
  eventGetImage (event) {
    wx.hideLoading()
    const { tempFilePath } = event.detail
    this.setData({
      shareImage: tempFilePath
    })
  },
  getQrCode () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserQrcode,
      data: {
        uid: app.gs('userInfoAll').id,
        mid: app.gs('shopInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            qrCode: res.data.data
          }, that.eventDraw)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getQrcode2 () {
    let that = this
    app.wxrequest({
      url: app.getUrl().qrcode,
      data: {
        pid: that.data.sid,
        uid: app.gs('userInfoAll').id,
        mid: app.gs('shopInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            qrCode: res.data.data
          }, that.eventDraw2)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  savePhoto () {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success () {
        wx.showToast({
          title: '保存成功'
        })
      },
      fail () {
        app.setToast(that, {content: '请授权相册保存'})
        that.setData({
          buttonShow: true
        })
      }
    })
  },
  openSettingO (e) {
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      this.setData({
        buttonShow: false
      })
    } else {
      this.setData({
        buttonShow: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options.id) {
      app.setBar('产品分享')
      this.data.sid = options.id
      this.getQrcode2()
    } else {
      app.setBar(app.gs('shopInfoAll').name)
      this.setData({
        info: app.gs('userInfoAll')
      }, this.getQrCode)
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
