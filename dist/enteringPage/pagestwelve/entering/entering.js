'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ttArr: ['特约讲师', '跟师学孵化基地'],
    is_teacher: app.gs('userInfoAll').is_teach || 0,
    tabIndex: 0,
    giftIndex: 0,
    cttIndex: 0,
    bgcS: '#FDA36E',
    bgcE: '#F48280',
    title: 'entering'
  },
  choosetoptab: function choosetoptab(e) {
    this.setData({
      cttIndex: e.currentTarget.dataset.index
    });
  },
  chooseGift: function chooseGift(e) {
    app.WP('ruler', 'html', this.data.lists[e.currentTarget.dataset.index].rule, this, 5);
    this.setData({
      giftIndex: e.currentTarget.dataset.index
    });
  },
  openGift: function openGift() {
    this.setData({
      open: !this.data.open
    });
  },
  getlists: function getlists() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().userGift,
      data: {
        style: that.data.tabIndex * 1 + 1
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.WP('ruler', 'html', res.data.data[0].rule, that, 5);
          that.setData({
            lists: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  noup: function noup() {},
  rulerChange: function rulerChange() {
    this.setData({
      rulerShow: !this.data.rulerShow
    });
  },
  gethomeEquity: function gethomeEquity() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().homeEquity,
      data: {},
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.WP('quanyi', 'html', res.data.data.context, that, 0);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  getInfo: function getInfo() {
    var that = this;
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
            is_teacher: res.data.data.is_teach
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
  onLoad: function onLoad(options) {
    this.getlists();
    this.gethomeEquity();
    if (options && options.id) {
      app.wxlogin(options.id);
    }
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
    if (app.gs('userInfoAll')) {
      this.getInfo();
    }
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
//# sourceMappingURL=entering.js.map
