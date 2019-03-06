'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    testImg: app.data.testImg,
    imgArr: [],
    title: 'feedback'
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  formSubmit: function formSubmit(e) {
    var that = this;
    if (!e.detail.value.content) return app.setToast(this, { content: '请输入反馈内容' });
    if (that.data.options.id) {
      return app.wxrequest({
        url: app.getUrl().homeReport,
        data: {
          user_id: that.data.options.userid,
          style: that.data.options.style,
          obj_id: that.data.options.id,
          title: that.data.options.title,
          reason: e.detail.value.content
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            wx.showToast({
              title: '反馈成功'
            });
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      });
    } else if (!e.detail.value.contact) return app.setToast(this, { content: '请输入联系方式' });
    app.wxrequest({
      url: app.getUrl().userFeedback,
      data: {
        user_id: app.gs('userInfoAll').id,
        desc: e.detail.value.content,
        contact: e.detail.value.contact
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          wx.showToast({
            title: '反馈成功'
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1200);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  del: function del(e) {
    this.data.imgArr.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgArr: this.data.imgArr
    });
  },
  showImg: function showImg(e) {
    app.showImg(e);
  },
  upImg: function upImg(e) {
    var that = this;
    app.wxUploadImg(function (res) {
      console.log(res);
      that.data.imgArr.push({
        url: that.data.imgDomain + '/' + res.path,
        id: res.id
      });
      that.setData({
        imgArr: that.data.imgArr
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options
    });
    if (options.id) app.setBar('举报');
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