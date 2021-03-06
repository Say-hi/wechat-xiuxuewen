'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chooseIndex: 0,
    moneyArr: [500, 1000, 5000]
  },
  inputvalue: function inputvalue(e) {
    this.data.inputMoney = e.detail.value;
  },
  chooseCharge: function chooseCharge(e) {
    this.setData({
      chooseIndex: e.currentTarget.dataset.type,
      focus: false
    });
  },
  focusinput: function focusinput() {
    this.setData({
      chooseIndex: -1,
      focus: true
    });
  },
  getlist: function getlist() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().rechargeList,
      data: {},
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            moneyArr: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  charge: function charge() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().rechargePay,
      data: {
        mid: app.gs('shopInfoAll').id,
        uid: that.data.agents >= 1 ? app.gs('shopInfoAll').id : app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid,
        phone: app.gs('userInfoAll').phone || '暂无',
        name: app.gs('userInfoAll').mall_rname || app.gs('userInfoAll').nickname || '暂无',
        total_fee: that.data.chooseIndex < 0 ? that.data.inputMoney : that.data.moneyArr[that.data.chooseIndex].pirce
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.wxpay2(res.data.data.msg).then(function () {
            wx.showToast({
              title: '支付成功'
            });
            wx.navigateBack();
          }).catch(function () {
            wx.showToast({
              title: '支付失败'
            });
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      recharge: options.money,
      agents: options.agents
    }, this.getlist);
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