'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    startText: ['零', '一', '二', '三', '四', '五', '六', '七'],
    img: app.data.testImg
  },
  showOutMoney: function showOutMoney() {
    this.setData({
      showMoney: !this.data.showMoney
    });
  },
  getUser: function getUser() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            userInfo: res.data.data,
            agents: res.data.data.mall_is > 0
          }, that.shopInfo);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  shopMoneyRuler: function shopMoneyRuler() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopMoneyRuler,
      data: {},
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.WP('ruler', 'html', res.data.data.content, that, 0);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  shopUserFund: function shopUserFund() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserFund,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.status === 200) {
          that.setData({
            info: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onShareAppMessage: function onShareAppMessage() {
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: '/pages/index/index',
        imageUrl: app.gs('shareText').g
      };
    } else {
      return {
        title: '\u5411\u60A8\u63A8\u8350\u5E97\u94FA\u3010' + app.gs('shopInfoAll').name + '\u3011',
        imageUrl: '' + (app.gs('shopInfoAll').avatar || ''),
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id + '&user=' + app.gs('userInfoAll').id
      };
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {

    // this.shopMoneyRuler()
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
    this.getUser();
    this.shopUserFund();
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
    this.shopUserFund();
    // TODO: onPullDownRefresh
  }
});