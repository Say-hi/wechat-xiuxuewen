'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    reservation_bg: app.data.reservation_bg,
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    title: '',
    teacher: {
      nodes: []
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText') || '绣学问，真纹绣',
      path: '/pages/index/index'
    };
  },
  showMore: function showMore(e) {
    if (e.currentTarget.dataset.type === 'comment') {
      return this.setData({
        showComment: !this.data.showComment
      });
    }
    this.setData({
      show_more: !this.data.show_more
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
//# sourceMappingURL=reservationDetail.js.map
