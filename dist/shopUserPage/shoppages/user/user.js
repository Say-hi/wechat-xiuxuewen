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
            info: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  chooseDay: function chooseDay(e) {
    this.setData({
      today: e.currentTarget.dataset.type === 'today'
    });
  },
  onShareAppMessage: function onShareAppMessage() {
    var that = this;
    return {
      title: '\u5411\u60A8\u63A8\u8350\u5E97\u94FA\u3010' + that.data.info.name + '\u3011',
      imageUrl: '' + (that.data.info.avatar || ''),
      path: '/shopPage/shoppages/index/index?mid=' + that.data.id
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    this.getUser();
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
//# sourceMappingURL=user.js.map
