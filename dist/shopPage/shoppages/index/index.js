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
    if (this.data.noshop) return;
    var that = this;
    if (this.data.goodslabel[this.data.labelIndex].name === '搜索') return this.search();
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: app.gs('shopInfoAll').id,
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
    if (this.data.noshop) return;
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
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: '/pages/index/index',
        imageUrl: app.gs('shareText').g
      };
    } else {
      return {
        title: '\u5411\u60A8\u63A8\u8350\u5E97\u94FA\u3010' + that.data.info.name + '\u3011',
        imageUrl: '' + (that.data.info.avatar || ''),
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id + '&user=' + app.gs('userInfoAll').id
      };
    }
  },
  getUser: function getUser() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (!res.data.data.mall_id && app.gs('shopInfo').mid) that.shopBinding();
          that.setData({
            userInfo: res.data.data
          });
          if (res.data.data.mall_is * 1 === 1) {
            app.su('shopInfo', { mid: res.data.data.id });
            that.setData({
              noshop: false
            }, that.getVideo);
          } else if (res.data.data.mall_id) {
            app.su('shopInfo', { mid: res.data.data.mall_id });
            that.setData({
              noshop: false
            }, that.getVideo);
          } else {
            that.setData({
              noshop: !app.gs('shopInfo').mid
            }, that.getVideo);
          }
        } else {
          if (res.data.desc === '发生错误,联系管理员') {
            wx.removeStorageSync('userInfoAll');
            app.wxlogin();
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      }
    });
  },
  showTip: function showTip() {
    wx.showModal({
      title: '未进入店铺',
      content: '请扫码店主的【小程序码】或通过店主的【小程序分享】进入',
      showCancel: false
    });
  },
  shopBinding: function shopBinding() {
    console.log({
      mid: app.gs('shopInfo').mid,
      sid: app.gs('shopInfo').user,
      uid: app.gs('userInfoAll').id
    });
    app.wxrequest({
      url: app.getUrl().shopBinding,
      data: {
        mid: app.gs('shopInfo').mid,
        sid: app.gs('shopInfo').user,
        uid: app.gs('userInfoAll').id
      },
      complete: function complete() {
        wx.hideLoading();
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin();
    if (!app.gs('shopInfo').mid) {
      app.su('shopInfo', options);
      this.getUser();
    } else {
      this.getUser();
    }
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
    this.getUser();
  }
});