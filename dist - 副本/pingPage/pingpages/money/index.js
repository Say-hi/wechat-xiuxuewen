"use strict";

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    systemVersion: app.data.systemVersion,
    img: app.data.testImg,
    labelIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    // this.setData({
    //   move: !this.data.move
    // })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // this.setData({
    //   move: !this.data.move
    // })
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
    this.getUser();
  }
});