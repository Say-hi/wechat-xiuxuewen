'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
            list: res.data.data.lists || []
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
          if (app.gs('getInPid') > 0) {
            that.setData({
              productMask: true,
              pid: app.gs('getInPid')
            }, app.su('getInPid', -1));
          }
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
    if (this.data.goodslabel[e.currentTarget.dataset.index].name !== '搜索') {
      return wx.navigateTo({
        url: this.data.goodslabel[e.currentTarget.dataset.index].id * 1 === 9 ? '/sucaiPage/sucai/sucai' : '/shopListPage/shoplistpages/list/list?index=' + e.currentTarget.dataset.index
      });
    }
    this.setData({
      goodslabel: this.data.goodslabel,
      scrollId: e.currentTarget.dataset.index - 1 < 0 ? 0 : e.currentTarget.dataset.index - 1,
      labelIndex: e.currentTarget.dataset.index
    }, this.getShopProduct);
  },
  search: function search() {
    var that = this;
    if (!this.data.searchText || this.data.searchText.length <= 0) return app.setToast(this, { content: '请输入搜索的内容' });
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: app.gs('shopInfoAll').id,
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
        mid: app.gs('shopInfo').mid || 10000
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (res.data.data.status < 0) {
            app.setToast(that, { content: '该店因违规被封闭，即将跳转回官方店铺' });
            setTimeout(function () {
              app.su('shopInfo', { mid: 10000 });
              return that.shopInfo();
            }, 1500);
          }
          app.su('shopInfoAll', res.data.data);
          try {
            res.data.data.ad = res.data.data.ad.split(',');
          } catch (err) {
            console.log(err);
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
        pid: that.data.goods[e.target.dataset.index].id,
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
    var that = this;
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: '/pages/index/index',
        imageUrl: app.gs('shareText').g
      };
    } else {
      return {
        title: '' + (e.from !== 'menu' ? e.target.dataset.index > -1 ? '【好物推荐】' + that.data.goods[e.target.dataset.index].title : '向您推荐店铺【' + that.data.info.name + '】' : '向您推荐店铺【' + that.data.info.name + '】'),
        imageUrl: '' + (e.from !== 'menu' ? e.target.dataset.index > -1 ? that.data.goods[e.target.dataset.index].img : that.data.info.avatar || '' : that.data.info.avatar || ''),
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id + '&user=' + app.gs('userInfoAll').id + '&pid=' + (e.from !== 'menu' ? e.target.dataset.index > -1 ? that.data.goods[e.target.dataset.index].id : -1 : -1)
      };
    }
  },
  getUser: function getUser(out) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
        // uid: 10000
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.su('userInfoAll', Object.assign(app.gs('userInfoAll'), { star: res.data.data.star }));
          // if (res.data.data.mall_id <= 10000 && app.gs('shopInfo').mid > 10000 && app.gs('shopInfo').user) that.shopBinding()
          that.shopBinding(out);
          if (!that.data.userInfo || that.data.userInfo.nickname !== '未登录用户请在【用户中心】进行登录') {
            that.setData({
              userInfo: res.data.data
            });
            if (res.data.data.nickname === '游客' || !res.data.data.phone || res.data.data.phone.length < 6) return;
          }
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
          that.checkLvShow();
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
  shopBinding: function shopBinding(out) {
    if (out) return;
    var that = this;
    if (!app.gs('shopInfo').mid) return;
    app.wxrequest({
      url: app.getUrl().shopBinding,
      data: {
        mid: app.gs('shopInfo').mid,
        sid: app.gs('shopInfo').user,
        uid: app.gs('userInfoAll').id
      },
      complete: function complete() {
        that.getUser(1);
        wx.hideLoading();
      }
    });
  },
  showShare: function showShare() {
    this.setData({
      cardshare: !this.data.cardshare
    });
  },
  phone: function phone(e) {
    var that = this;
    wx.login({
      success: function success(res) {
        app.wxrequest({
          url: app.getUrl().shopPhone,
          data: {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            uid: that.data.userInfo.id
          },
          success: function success(res) {
            wx.hideLoading();
            if (res.data.status === 200) {
              that.getUser();
            } else {
              app.setToast(that, { content: res.data.desc });
            }
          }
        });
      }
    });
  },
  login: function login() {
    app.wxlogin();
  },
  goNow: function goNow() {
    var _setData;

    this.setData((_setData = {}, _defineProperty(_setData, 'userInfo.nickname', '未登录用户请在【我的】进行登录'), _defineProperty(_setData, 'userInfo.phone', 18888888888), _setData), this.getVideo);
  },
  getPinPic: function getPinPic() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().pinenter,
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            pic: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  close: function close() {
    this.setData({
      productMask: false
    });
  },
  checkLvShow: function checkLvShow(e) {
    if (e) {
      this.setData({
        lvShow: false
      });
      app.su('beforeShow', app.gs('userInfoAll').star || 5);
      return;
    }
    var that = this;
    this.setData({
      lvShow: app.gs('beforeShow') * 1 !== app.gs('userInfoAll').star * 1
    }, function () {
      if (that.data.lvShow) {
        that.setData({
          lvStar: app.gs('userInfoAll').star || 5
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.getPinPic();
    console.log('options', options);
    if (options.scene) {
      var scene = decodeURIComponent(options.scene).split('&');
      app.su('shopInfo', { mid: scene[0].split('=')[1], user: scene[1].split('=')[1] });
      options.pid = scene[2] ? scene[2].split('=')[1] : -1;
    } else {
      app.su('shopInfo', options);
    }
    try {
      if (options.pid >= 0) {
        app.su('getInPid', options.pid);
      }
    } catch (err) {
      console.log(err);
    }
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin();
    this.getUser();
  },


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