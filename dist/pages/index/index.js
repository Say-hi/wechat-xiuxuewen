'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
var bmap = require('../../utils/bmap-wx');
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    HEIGHT_TOP: app.data.HEIGHT_TOP,
    ALL_HEIGHT: app.data.ALL_HEIGHT,
    page: 0,
    answerArr: [],
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    indicatorActiveColorVideo: '#dab866',
    show: true,
    tabNav: []
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  open_site: function open_site(e) {
    if (e.detail.authSetting['scope.userLocation']) {
      wx.showToast({
        title: '授权成功'
      });
      this.setData({
        openType: null
      });
      var that = this;
      setTimeout(function () {
        that.Bmap(that);
      }, 100);
    }
  },
  choose_site: function choose_site() {
    var that = this;
    if (!this.data.openType) {
      wx.chooseLocation({
        success: function success(res) {
          that.setData({
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }, that.Bmap(that, res.longitude + ',' + res.latitude));
        }
      });
    }
  },
  Bmap: function Bmap(that, site) {
    var BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    });
    BMap.regeocoding({
      location: site || null,
      success: function success(res) {
        that.setData({
          addressInfo: res
        });
      },
      fail: function fail(data) {
        that.setData({
          openType: 'openSetting'
        });
        console.log('fail', data);
      }
    });
  },
  getLocation: function getLocation() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.su('userLocation', res);
        that.getIndex();
      }
    });
  },
  MaskGetUserInfo: function MaskGetUserInfo(e) {
    if (e.detail.iv) {
      this.setData({
        needUserInfo: false
      });
      app.wxlogin(this.getLocation);
    }
  },
  goOther: function goOther(e) {
    app.goOther(e);
  },
  getCourse: function getCourse() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().course,
      data: {
        page: 1,
        style: 2
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var list = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              list.push({
                id: v.id,
                avatar: v.avatar,
                image: v.image,
                room_name: v.room_name,
                title: v.title,
                price: v.price > 0 ? v.price : '免费'
              });
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          that.setData({
            list: list
          });
        }
      }
    });
  },
  getUser: function getUser() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success: function success(res) {
        app.su('userInfoAll', Object.assign(app.gs('userInfoAll'), { star: res.data.data.star }));
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            userInfo: res.data.data
          }, that.checkLvShow);
        }
      }
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

    this.setData((_setData = {}, _defineProperty(_setData, 'userInfo.nickname', '未登录用户'), _defineProperty(_setData, 'userInfo.phone', 18888888888), _setData));
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
    var that = this;
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin();
    this.getUser();
    app.getNavTab({
      style: 3,
      cb: function cb(res) {
        that.setData({
          swiperArr: res.data.data
        });
        app.getNavTab({
          style: 2,
          cb: function cb(res) {
            that.setData({
              tabNav: res.data.data
            });
            that.getCourse();
          }
        });
      }
    });
    this.Bmap(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    // console.log(' ---------- onReady ----------')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    // this.setKill()
    // console.log(' ---------- onShow ----------')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    this.getCourse();
  }
});