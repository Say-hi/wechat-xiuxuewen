'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: app.data.testImg
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  inputValue: function inputValue(e) {
    console.log(e);
    this.setData({
      outMoney: e.detail.value * 1 >= this.data.profit ? this.data.profit * 1 : e.detail.value * 1
    });
  },
  shopUserCash: function shopUserCash() {
    var that = this;
    if (!this.data.outMoney || this.data.outMoney < 1) return app.setToast(this, { content: '最小提现额度为1' });
    app.wxrequest({
      url: app.getUrl().shopUserCash,
      data: {
        uid: app.gs('userInfoAll').id,
        amount: that.data.outMoney
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          wx.showToast({
            title: '提现成功'
          });
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
        if (res.data.status === 200) {
          that.setData({
            profit: res.data.data.mall_total_fee
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  showScroll: function showScroll() {
    this.setData({
      showS: !this.data.showS
    });
  },
  back: function back() {
    wx.navigateBack();
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
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id
      };
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
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
    // TODO: onPullDownRefresh
  }
});
//# sourceMappingURL=index.js.map
