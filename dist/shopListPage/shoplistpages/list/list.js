'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playIndex: -1,
    img: app.data.testImg,
    goodslabel: ['色乳类', '色乳类', '色乳类', '色乳类', '色乳类', '色乳类', '色乳类色乳类色乳类色乳类'],
    videoSrc: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
  },
  playVideo: function playVideo(e) {
    var that = this;
    that.setData({
      playIndex: e.currentTarget.dataset.index
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
//# sourceMappingURL=list.js.map
