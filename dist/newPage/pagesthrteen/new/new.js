'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lvIndex: 0,
    tabIndex: 0,
    autoplay: true,
    titleArr: ['第一阶段：夯实基础学技术', '第二阶段：个人素养应提升', '第三阶段：光环效应须“包装”'],
    videoUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    testImg: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/005.png'
  },
  showImg: function showImg(e) {
    app.showImg(e.currentTarget.dataset.src, [e.currentTarget.dataset.src]);
  },
  swiperChange: function swiperChange(e) {
    this.setData({
      tabIndex: e.detail.current
    });
  },
  lvChoose: function lvChoose(e) {
    this.setData({
      lvIndex: e.currentTarget.dataset.index
    });
  },
  chooseTab: function chooseTab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    });
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  getGrow: function getGrow() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().homeGrow,
      data: {},
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            growUp: res.data.data
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
  onLoad: function onLoad() {
    this.getGrow();
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