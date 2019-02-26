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
  inputName: function inputName(e) {
    wx.showToast({
      title: '修改完成'
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
      title: '' + (that.data.info.share_title || '邀请您入驻绣学问，成为优秀的纹绣人'),
      imageUrl: '' + (that.data.info.share_imageUrl || ''),
      path: '/enteringPage/pagestwelve/entering/entering?id=' + app.gs('userInfoAll').id
    };
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
