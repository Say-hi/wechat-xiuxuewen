'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    videoTab: [{
      t: '课程列表'
    }, {
      t: '老师介绍'
    }],
    reservation_bg: app.data.reservation_bg,
    testImg: app.data.testImg
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText') || '绣学问，真纹绣',
      path: '/pages/index/index'
    };
  },
  chooseIndex: function chooseIndex(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    });
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
//# sourceMappingURL=teacherDetail.js.map
