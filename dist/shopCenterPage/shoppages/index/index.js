'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    labelIndex: 0,
    page: 0,
    list: [],
    img: app.data.testImg
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
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
          that.setData({
            agents: res.data.data.mall_is > 0,
            mid: res.data.data.mall_id
          });
          if (res.data.data.mall_is > 0) {
            that.getShopOrder();
            that.getCategory();
          }
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  upGoods: function upGoods(e) {
    var that = this;
    if (e.currentTarget.dataset.type === 'now') {
      wx.showModal({
        title: '上传确认',
        content: '是否确认上传此商品',
        success: function success(res) {
          if (res.confirm) {
            wx.showModal({
              title: '上传方式',
              content: '请选择您的上传方式',
              confirmText: '编辑上传',
              cancelText: '直接上传',
              success: function success(res2) {
                if (res2.confirm) {
                  wx.navigateTo({
                    url: '/shopEditPage/shoppages/index/index?id=' + e.currentTarget.dataset.id
                  });
                } else if (res2.cancel) {
                  that.shopProduct(e.currentTarget.dataset.id, 1);
                }
              }
            });
          }
        }
      });
    } else {
      wx.showModal({
        title: '放入仓库',
        content: '是否确认将此商品放入仓库',
        success: function success(res) {
          if (res.confirm) {
            that.shopProduct(e.currentTarget.dataset.id, -1);
          }
        }
      });
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: '/pages/index/index',
        imageUrl: app.gs('shareText').g
      };
    } else {
      return {
        title: '\u5411\u60A8\u63A8\u8350\u5E97\u94FA\u3010' + app.gs('shopInfoAll').name + '\u3011',
        imageUrl: '' + (app.gs('shopInfoAll').avatar || ''),
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id + '&user=' + app.gs('userInfoAll').id
      };
    }
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
          }, that.getShopProduct);
          app.su('shopLabel', res.data.data);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  chooseLabel: function chooseLabel(e) {
    this.data.page = 0;
    this.data.list = [];
    this.setData({
      labelIndex: e.currentTarget.dataset.index
    }, this.getShopProduct);
  },
  getShopProduct: function getShopProduct() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: 0,
        page: ++that.data.page,
        cid: that.data.goodslabel[that.data.labelIndex].id
      },
      success: function success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.status === 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.lists) || [],
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  getShopOrder: function getShopOrder() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopCenter,
      data: {
        mid: that.data.mid
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            topInfo: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  shopProduct: function shopProduct(pid, isUp) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopProduct,
      data: {
        pid: pid
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var info = res.data.data;
          app.wxrequest({
            url: app.getUrl().shopRelease,
            data: {
              mid: app.gs('shopInfoAll').id,
              cid: info.cid,
              parent_id: info.id,
              title: info.title,
              img: info.img,
              imgs: info.imgs || [],
              old_price: info.old_price,
              freight: info.freight,
              is_up: isUp,
              label: info.label,
              sku: JSON.stringify(info.sku),
              detail: info.detail || [],
              detail_text: info.detail_text || ''
            },
            success: function success(res2) {
              wx.hideLoading();
              if (res2.data.status === 200) {
                wx.showToast({
                  title: '添加成功'
                });
              } else {
                app.setToast(that, { content: res2.data.desc });
              }
            }
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  getAd: function getAd() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopAd,
      data: {
        style: 1
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            ad: res.data.data
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
    this.getUser();
    this.getAd();
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
    this.getUser();
    // TODO: onPullDownRefresh
  }
});