'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    systemVersion: app.data.systemVersion,
    labelIndex: 0,
    page: 0,
    list: [],
    img: app.data.testImg
  },
  chooseLabel: function chooseLabel(e) {
    if (this.data.goodslabel[e.currentTarget.dataset.index].id * 1 === 9) {
      return wx.navigateTo({
        url: '/sucaiPage/sucai/sucai'
      });
    }
    this.data.page = 0;
    this.data.list = [];
    this.setData({
      goodslabel: this.data.goodslabel,
      scrollId: e.currentTarget.dataset.index - 1 < 0 ? 0 : e.currentTarget.dataset.index - 1,
      labelIndex: e.currentTarget.dataset.index
    }, this.getShopProduct);
  },
  getShopProduct: function getShopProduct() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: app.gs('shopInfoAll').id,
        page: ++that.data.page,
        cid: that.data.goodslabel[that.data.labelIndex].id
      },
      success: function success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.status === 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  getQrcode: function getQrcode(e) {
    if (e.currentTarget.dataset.index < 0) {
      this.setData({
        qrimg: null
      });
      return;
    }
    var that = this;
    app.wxrequest({
      url: app.getUrl().qrcode,
      data: {
        pid: that.data.list[e.target.dataset.index].id,
        uid: app.gs('userInfoAll').id,
        mid: app.gs('shopInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            qrimg: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onShareAppMessage: function onShareAppMessage(e) {
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: '/pages/index/index',
        imageUrl: app.gs('shareText').g
      };
    } else {
      return {
        title: '' + (e.from !== 'menu' ? e.target.dataset.index > -1 ? '【好物推荐】' + this.data.list[e.target.dataset.index].title : '向您推荐店铺【' + app.gs('shopInfoAll').name + '】' : '向您推荐店铺【' + app.gs('shopInfoAll').name + '】'),
        imageUrl: '' + (e.from !== 'menu' ? e.target.dataset.index > -1 ? this.data.list[e.target.dataset.index].img : app.gs('shopInfoAll').avatar || '' : app.gs('shopInfoAll').avatar || ''),
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id + '&user=' + app.gs('userInfoAll').id + '&pid=' + (e.from !== 'menu' ? e.target.dataset.index > -1 ? this.data.list[e.target.dataset.index].id : -1 : -1)
      };
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      scrollId: options.index - 1 < 0 ? 0 : options.index - 1,
      labelIndex: options.index,
      goodslabel: app.gs('shopLabel')
    }, this.getShopProduct);
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
  onReachBottom: function onReachBottom() {
    if (this.data.more > 0) this.getShopProduct();else app.setToast(this, { content: '没有更多内容啦' });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    this.data.page = 0;
    this.data.list = [];
    this.getShopProduct();
    // TODO: onPullDownRefresh
  }
});