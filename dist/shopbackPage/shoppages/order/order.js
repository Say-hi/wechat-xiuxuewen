'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  changeShow: function changeShow(e) {
    this.setData({
      refuseMask: !this.data.refuseMask
    });
    if (e.currentTarget.dataset.type === 'confirm') this.refuse(e);
  },
  refuse: function refuse(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().pingrefund,
      data: {
        oid: that.data.options.oid,
        mid: that.data.options.mid || app.gs('shopInfoAll').id,
        uid: that.data.options.uid,
        is_refuse: e.currentTarget.dataset.refuse === 'agree' ? 1 : -1
      },
      success: function success(res) {
        wx.hideLoading();
        // that.setData({
        //   confirmRefuse: true,
        //   agree: e.currentTarget.dataset.refuse === 'agree'
        // })
        if (res.data.status === 200) {
          that.setData({
            confirmRefuse: true,
            agree: e.currentTarget.dataset.refuse === 'agree'
          });
        } else {
          app.setToast(that, { content: res.data.desc || '服务器出错啦~~' });
        }
      }
    });
  },
  getDetail: function getDetail() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().pinorefund,
      data: {
        oid: that.data.options.oid,
        uid: that.data.options.uid,
        mid: app.gs('shopInfoAll').id,
        out_trade_no: that.data.options.out_trade_no
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            info: res.data.data,
            confirmRefuse: res.data.data.status * 1 !== 1,
            agree: res.data.data.status * 1 === 2
          });
        } else {
          app.setToast(that, { content: res.data.desc });
          setTimeout(function () {
            wx.navigateBack();
          }, 1000);
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options
    }, this.getDetail);
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