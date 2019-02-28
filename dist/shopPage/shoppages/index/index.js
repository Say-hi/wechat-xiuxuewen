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
    labelIndex: 0
  },
  inputValue: function inputValue(e) {
    this.data.searchText = e.detail.value;
  },
  getVideo: function getVideo() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopVideoList,
      data: {},
      success: function success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.status === 200) {
          that.setData({
            list: res.data.data.lists
          }, that.getCategory);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  getCategory: function getCategory() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopCategoryList,
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            goodslabel: res.data.data
          }, that.shopInfo);
          app.su('shopLabel', res.data.data);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  getShopProduct: function getShopProduct() {
    var that = this;
    if (this.data.goodslabel[this.data.labelIndex].name === '搜索') return this.search();
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: 0,
        cid: that.data.goodslabel[that.data.labelIndex].id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            goods: res.data.data.lists
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  chooseLabel: function chooseLabel(e) {
    this.setData({
      goodslabel: this.data.goodslabel,
      labelIndex: e.currentTarget.dataset.index
    }, this.getShopProduct);
  },
  search: function search() {
    var that = this;
    if (!this.data.searchText || this.data.searchText.length <= 0) return app.setToast(this, { content: '请输入搜索的内容' });
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: 0,
        title: that.data.searchText
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (that.data.goodslabel[0].name !== '搜索') {
            that.data.goodslabel.unshift({
              name: '搜索'
            });
          }
          that.setData({
            labelIndex: 0,
            goodslabel: that.data.goodslabel,
            goods: res.data.data.lists
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  shopInfo: function shopInfo() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopInfo,
      data: {
        mid: app.gs('shopInfo').mid || 1
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (!app.gs('shopInfoAll')) {
            app.su('shopInfoAll', res.data.data);
          }
          that.setData({
            info: res.data.data
          }, that.getShopProduct);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  noUse: function noUse() {
    app.noUse();
  },
  playVideo: function playVideo(e) {
    var that = this;
    if (e.currentTarget.dataset.index >= 0) app.videoCount(this.data.list[e.currentTarget.dataset.index].id);
    this.setData({
      play: !that.data.play,
      playIndex: e.currentTarget.dataset.index
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
  onLoad: function onLoad(options) {
    if (!app.gs('shopInfo').mid) {
      app.su('shopInfo', options);
      if (!app.gs('shopInfo').mid) {
        wx.showModal({
          title: '进入错误',
          content: '请扫码店主的【小程序码】或从【店主分享】进入',
          showCancel: false,
          success: function success() {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }
        });
      }
    }
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin();
    this.getVideo();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    this.setData({
      move: !this.data.move
    });
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    this.setData({
      move: !this.data.move
    });
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
    this.getVideo();
  }
});
//# sourceMappingURL=index.js.map
