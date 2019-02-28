'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: app.data.testImg,
    today: true
  },
  shopUserReal: function shopUserReal(name) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserReal,
      data: {
        uid: app.gs('userInfoAll').id,
        mall_rname: name
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          wx.showToast({
            title: '修改完成'
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  inputName: function inputName(e) {
    if (e.detail.value.length <= 0) return app.setToast(this, { content: '请输入内容' });
    if (this.data.options.type === 'user') {
      this.shopUserReal(e.detail.value);
    }
  },
  chooseDay: function chooseDay(e) {
    this.setData({
      today: e.currentTarget.dataset.type === 'today'
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
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id
      };
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options
    });
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
//# sourceMappingURL=set.js.map
