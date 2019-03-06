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
    operationArr: []
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  goStore: function goStore() {
    // wx.navigateTo({
    //   url: '/storePage/pagesstore/index/index'
    // })
    if (app.gs('userInfoAll').is_teach >= 1) {
      wx.navigateTo({
        url: '/storePage/pagesstore/index/index'
      });
    } else {
      wx.showModal({
        title: '未开通教室',
        content: '亲爱的用户您还没有开通教室权限哦',
        cancelText: '下次开通',
        confirmText: '立即开通',
        success: function success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/enteringPage/pagestwelve/entering/entering'
            });
          }
        }
      });
    }
  },
  getInfo: function getInfo() {
    var that = this;
    console.log('userInfoAll', app.gs('userInfoAll'));
    console.log('userInfoAll.id', app.gs('userInfoAll').id);
    try {
      app.wxrequest({
        url: app.getUrl().userInfo,
        data: {
          user_id: app.gs('userInfoAll').id
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            app.su('userInfoAll', res.data.data);
            that.setData({
              userInfo: res.data.data
            });
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  getUserInfoBtn: function getUserInfoBtn(res) {
    if (res.detail.iv) app.wxlogin();
  },
  getUserOperation: function getUserOperation() {
    var that = this;
    if (app.gs('operationArr')) {
      this.setData({
        operationArr: app.gs('operationArr')
      });
    }
    app.cloud().getUserOperation().then(function (res) {
      that.setData({
        operationArr: res.operationArr
      });
      app.su('operationArr', res.operationArr);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    this.getInfo();
    this.getUserOperation();
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
    // this.getAllRects()
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