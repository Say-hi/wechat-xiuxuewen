'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.baseDomain,
    painting: {},
    color: '#0094ff',
    shareImage: ''
  },
  eventDraw: function eventDraw(e) {
    wx.showLoading({
      title: '定制专属海报中',
      mask: true
    });
    var that = this;
    this.setData({
      painting: {
        width: 375,
        height: 603,
        clear: true,
        views: [{
          type: 'image',
          url: app.gs('userInfoAll').avatar_url,
          top: 30,
          left: 30,
          width: 70,
          height: 70
        }, {
          type: 'image',
          url: '' + that.data.qrCode,
          top: 232,
          left: 115,
          width: 160,
          height: 160
        }, {
          type: 'image',
          url: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/share/shop.png',
          top: 0,
          left: 0,
          width: 375,
          height: 603
        }, {
          type: 'text',
          content: '\u3010' + app.gs('shopInfoAll').name + '\u3011',
          top: 55,
          left: 105,
          width: 500
        }]
      }
    });
  },
  eventGetImage: function eventGetImage(event) {
    wx.hideLoading();
    var tempFilePath = event.detail.tempFilePath;

    this.setData({
      shareImage: tempFilePath
    });
  },
  getQrCode: function getQrCode() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserQrcode,
      data: {
        uid: app.gs('userInfoAll').id,
        mid: app.gs('shopInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            qrCode: res.data.data
          }, that.eventDraw);
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  savePhoto: function savePhoto() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success: function success() {
        wx.showToast({
          title: '保存成功'
        });
      },
      fail: function fail() {
        app.setToast(that, { content: '请授权相册保存' });
        that.setData({
          buttonShow: true
        });
      }
    });
  },
  openSettingO: function openSettingO(e) {
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      this.setData({
        buttonShow: false
      });
    } else {
      this.setData({
        buttonShow: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    app.setBar(app.gs('shopInfoAll').name);
    this.setData({
      info: app.gs('userInfoAll')
    }, this.getQrCode);
    // TODO: onLoad
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    // TODO: onReady
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    // TODO: onShow
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // TODO: onHide
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});