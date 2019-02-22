'use strict';

/*eslint-disable*/
var useUrl = require('./utils/service');
var wxParse = require('./wxParse/wxParse');
var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
var MenuButtonBounding = wx.getMenuButtonBoundingClientRect();
var HEIGHT_TOP = MenuButtonBounding.bottom - statusBarHeight;
var Moment = require('./utils/moment-min');
var _cloud = require('./utils/cloud');
Moment.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s前',
    s: '刚刚',
    m: '1分钟',
    mm: '%d分钟',
    h: '1小时',
    hh: '%d小时',
    d: '1天',
    dd: '%d天',
    M: '1个月',
    MM: '%d月',
    y: '1年',
    yy: '%d年'
  }
});
App({
  data: {
    // TOP_CENTER: ((MenuButtonBounding.right - MenuButtonBounding.left) / 2 / 2) + MenuButtonBounding.left,
    TOP_CENTER: MenuButtonBounding.right - 66,
    searchText: null,
    bottomTabIndex: 0,
    statusBarHeight: statusBarHeight,
    HEIGHT_TOP: HEIGHT_TOP,
    MenuButtonBounding: MenuButtonBounding,
    ALL_HEIGHT: statusBarHeight + HEIGHT_TOP,
    name: '绣学问小程序',
    label: [],
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    reservation_bg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/reservation_bg.png'
  },
  cloud: function cloud() {
    return _cloud;
  },
  momentAdd: function momentAdd(number, type, time) {
    if (time) {
      return Moment(time).add(number, type);
    } else {
      return Moment().add(number, type);
    }
  },
  momentDay: function momentDay(time) {
    return Moment().day(time);
  },
  momentFormat: function momentFormat(time, formatStr) {
    return Moment(time).format(formatStr);
  },
  call: function call() {
    var phoneNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '13378692079';

    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },

  // 富文本解析
  WP: function WP(title, type, data, that, image) {
    wxParse.wxParse(title, type, data, that, image);
  },

  // 解析时间
  moment: function moment(time) {
    return Moment(time).fromNow();
  },

  // 发起微信支付
  wxpay: function wxpay(obj) {
    console.log(obj);
    var objs = {
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType || 'MD5',
      paySign: obj.paySign,
      success: function success(payRes) {
        if (obj.success) {
          if (payRes.errMsg === 'requestPayment:ok') {
            obj.success(payRes);
          } else {
            obj.fail(payRes);
          }
        } else {
          console.log('未传入success回调函数', payRes);
        }
      },
      fail: function fail(err) {
        if (obj.fail) {
          obj.fail(err);
        } else {
          console.log('未传入fail回调函数,err:', err.errMsg);
        }
      },
      complete: obj.complete || function () {}
    };
    wx.requestPayment(objs);
  },

  // 下载内容获取临时路径
  downLoad: function downLoad(url) {
    return new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: url,
        success: function success(res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath);
          } else {
            resolve(0);
          }
        }
      });
    });
  },

  // 选择图片上传
  wxUploadImg: function wxUploadImg(cb) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var _that = this;
    wx.chooseImage({
      count: count,
      success: function success(res) {
        console.log(res);
        wx.showLoading({
          title: '图片上传中'
        });
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = res.tempFilePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var v = _step.value;

            wx.uploadFile({
              url: useUrl.upImage,
              filePath: v,
              name: 'file',
              formData: {
                id: _that.gs('userInfoAll').id || 1,
                file: v
              },
              success: function success(res) {
                console.log(res);
                wx.hideLoading();
                var parseData = JSON.parse(res.data);
                console.log(parseData);
              }
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
      }
    });
  },

  // 上传媒体文件
  wxUpload: function wxUpload(obj) {
    var s = {
      url: obj.url,
      filePath: obj.filePath,
      name: obj.name || 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: obj.formData,
      success: obj.success || function (res) {
        console.log('未传入成功回调函数', res);
      },
      fail: obj.fail || function (res) {
        console.log('为传入失败回调函数', res);
      },
      complete: obj.complete || function () {}
    };
    wx.uploadFile(s);
  },
  setNav: function setNav() {
    var that = this;
    var navArr = this.gs('navArr');
    var currentPage = getCurrentPages();
    var currentPath = currentPage[currentPage.length - 1]['__route__'].replace('pages', '..');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = navArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var v = _step2.value;

        if (v.path === currentPath) {
          v['active'] = true;
          that.setBar(v.title);
          break;
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return navArr;
  },

  // 请求数据
  wxrequest: function wxrequest(obj) {
    // let that = this
    wx.showLoading({
      title: '请求数据中...',
      mask: true
    });
    // console.log('obj', obj)
    // if (!obj.data.iv) {
    //   obj.data = Object.assign(obj.data, {session_key: that.gs()})
    // }
    wx.request({
      url: obj.url || useUrl.login,
      method: obj.method || 'POST',
      data: obj.data || {},
      header: {
        'content-type': obj.header || 'application/x-www-form-urlencoded'
      },
      success: obj.success || function () {
        console.log('未传入success回调函数');
      },
      fail: obj.fail || function (err) {
        console.log('未传入fail回调函数,err:' + err.errMsg);
      },
      complete: obj.complete || function (res) {
        console.log('url', obj.url);
        console.log('complete', res);
        wx.stopPullDownRefresh();
      }
    });
  },
  goOther: function goOther(e) {
    if (!e.currentTarget.dataset.url) {
      wx.previewImage({
        urls: [e.currentTarget.dataset.src]
      });
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },
  upFormId: function upFormId(e) {
    var that = this;
    this.wxrequest({
      url: that.getUrl().formid,
      data: {
        openid: that.gs(),
        formid: e.detail.formId
      },
      success: function success() {
        wx.hideLoading();
      }
    });
  },

  // 用户登陆
  wxlogin: function wxlogin(params) {
    var that = this;
    wx.login({
      success: function success(res) {
        var code = res.code;
        // 获取用户信息
        var obj = {
          success: function success(data) {
            wx.setStorageSync('userInfo', data.userInfo);
            var objs = {
              url: useUrl.login,
              data: params ? {
                parent_id: params,
                code: code,
                nickname: data.userInfo.nickName,
                avatar_url: data.userInfo.avatarUrl,
                sex: data.userInfo.gender,
                city: data.userInfo.city,
                country: data.userInfo.country,
                province: data.userInfo.province
              } : {
                code: code,
                nickname: data.userInfo.nickName,
                avatar_url: data.userInfo.avatarUrl,
                sex: data.userInfo.gender,
                city: data.userInfo.city,
                country: data.userInfo.country,
                province: data.userInfo.province
              },
              success: function success(session) {
                console.log('session', session);
                wx.hideLoading();
                wx.setStorageSync('key', session.data.data.openid);
                that.wxrequest({
                  url: that.getUrl().userInfo,
                  data: {
                    user_id: session.data.data.id
                  },
                  success: function success(res) {
                    wx.hideLoading();
                    if (res.data.status === 200) {
                      that.su('userInfoAll', res.data.data);
                      if (params) {
                        getCurrentPages()[getCurrentPages().length - 1].setData({
                          is_teacher: res.data.data.is_teach
                        });
                        return;
                      }
                      var currentPage = getCurrentPages();
                      var query = '';
                      try {
                        var s = currentPage[currentPage.length - 1].options;
                        for (var i in s) {
                          query += i + '=' + s[i] + '&';
                        }
                      } catch (err) {
                        query = currentPage[currentPage.length - 1]['__displayReporter']['showOptions']['query'];
                      }
                      console.log('query', query);
                      wx.reLaunch({
                        url: '/' + currentPage[currentPage.length - 1]['__route__'] + (query.length > 0 ? '?' + query : '')
                      });
                    }
                  }
                });
              }
            };
            that.wxrequest(objs);
          },
          fail: function fail(err) {
            console.warn('getUserInfo', err);
            var objs = {
              url: useUrl.login,
              data: params ? {
                code: code,
                parent_id: params
              } : {
                code: code
              },
              success: function success(session) {
                console.log('session', session);
                wx.hideLoading();
                wx.setStorageSync('key', session.data.data.openid);
                that.wxrequest({
                  url: that.getUrl().userInfo,
                  data: {
                    user_id: session.data.data.id
                  },
                  success: function success(res) {
                    wx.hideLoading();
                    if (res.data.status === 200) {
                      that.su('userInfoAll', res.data.data);
                      if (params) {
                        getCurrentPages()[getCurrentPages().length - 1].setData({
                          is_teacher: res.data.data.is_teach
                        });
                      }
                    }
                  }
                });
                if (params) return;
                var currentPage = getCurrentPages();
                var query = '';
                try {
                  var s = currentPage[currentPage.length - 1].options;
                  for (var i in s) {
                    query += i + '=' + s[i] + '&';
                  }
                } catch (err) {
                  query = currentPage[currentPage.length - 1]['__displayReporter']['showOptions']['query'];
                }
                console.log('query', query);
                wx.reLaunch({
                  url: '/' + currentPage[currentPage.length - 1]['__route__'] + (query.length > 0 ? '?' + query : '')
                });
              }
            };
            that.wxrequest(objs);
          }
        };
        that.getUserInfo(obj);
      },
      fail: function fail(err) {
        console.warn('loginError' + err);
      }
    });
  },

  // 获取缓存session_key
  gs: function gs(key) {
    return wx.getStorageSync(key || 'key');
  },

  // 设置页面是否加载
  setMore: function setMore(params, that) {
    if (params.length === 0) {
      that.setData({
        more: false
      });
    } else {
      that.setData({
        more: true
      });
    }
  },

  // 获取用户信息
  getUserInfo: function getUserInfo(obj) {
    wx.getUserInfo({
      withCredentials: obj.withCredentials || true,
      lang: obj.lang || 'zh_CN',
      success: obj.success || function (res) {
        console.log('getUserInfoSuccess', res);
      },
      fail: obj.fail || function (res) {
        console.log('getUserInfoFail', res);
      }
    });
  },

  // 获取用户缓存信息
  gu: function gu(cb) {
    if (wx.getStorageSync('userInfo')) {
      return wx.getStorageSync('userInfo');
    } else {
      var obj = {
        success: function success(res) {
          // console.log(res)
          wx.setStorageSync('userInfo', res.userInfo);
          if (cb) {
            cb();
          }
        }
      };
      return this.getUserInfo(obj);
    }
  },

  // 设置用户的缓存信息
  su: function su(key, obj) {
    wx.setStorageSync(key, obj);
  },

  // 输入内容
  inputValue: function inputValue(e, that, cb) {
    var value = e.detail.value;
    var type = e.currentTarget.dataset.type;
    if (type === 'teacher') {
      that.setData({
        teacherText: value
      });
    } else if (type === 'name') {
      that.setData({
        nameText: value // 姓名
      });
    } else if (type === 'phone') {
      that.setData({
        phoneText: value // 手机号码
      });
    } else if (type === 'brand') {
      that.setData({
        brandText: value // 品牌
      });
    } else if (type === 'contentTwo') {
      that.setData({
        contentTwo: value // 翻译
      });
    } else if (type === 'buddingText') {
      that.setData({
        buddingText: value // 我要配音
      });
    } else if (type === 'content') {
      that.setData({
        content: value
      });
    } else if (type === 'contentOne') {
      that.setData({
        contentOne: value
      });
    } else if (type === 'userNote') {
      that.setData({
        userNote: value
      });
    }
  },

  // 手机号码验证
  checkMobile: function checkMobile(mobile) {
    if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile)) {
      return true;
    }
  },

  // 信息弹窗
  setToast: function setToast(that, toast, time) {
    var defaultToast = {
      image: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/jiong.png',
      show: true,
      bgc: '#fff',
      color: '#000',
      content: '服务器开小差啦~~'
    };
    Object.assign(defaultToast, toast);
    that.setData({
      toast: defaultToast
    });
    setTimeout(function () {
      defaultToast.show = false;
      that.setData({
        toast: defaultToast
      });
    }, time || 1500);
  },

  // 预览图片
  showImg: function showImg(src, imgArr) {
    wx.previewImage({
      current: src,
      urls: imgArr
    });
  },

  // 跳转方式判断
  gn: function gn(url) {
    if (getCurrentPages().length >= 5) {
      wx.redirectTo({
        url: url
      });
    } else {
      wx.navigateTo({
        url: url
      });
    }
  },

  // 设置顶部文字
  setBar: function setBar(text) {
    wx.setNavigationBarTitle({
      title: text
    });
  },

  // 逆地址解析
  getLocation: function getLocation(that, type, cb) {
    this.reverseGeocoder(that, type, cb);
  },

  // 获取请求路劲
  getUrl: function getUrl() {
    return useUrl;
  },
  getFont: function getFont() {
    var that = this;
    wx.loadFontFace({
      family: 'jwq',
      source: 'url("https://at.alicdn.com/t/font_718305_0nntgpn0yem.ttf")',
      success: function success(res) {
        console.log(res);
        console.log(res.status); //  loaded
      },
      fail: function fail(res) {
        that.loadFont();
        console.log(res.status); //  error
      }
    });
  },

  // 获取小程序状态栏内容
  getNavTab: function getNavTab(_ref) {
    var _ref$style = _ref.style,
        style = _ref$style === undefined ? 1 : _ref$style,
        _ref$cb = _ref.cb,
        cb = _ref$cb === undefined ? null : _ref$cb;

    var that = this;
    this.wxrequest({
      url: that.getUrl().style,
      data: {
        style: style
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (style === 1) {
            that.su('bottomNav', res.data.data);
          } else {
            if (cb && typeof cb === 'function') {
              cb(res);
            }
          }
        } else {
          console.log('err', res);
        }
      }
    });
  },

  // 地址计算
  distance: function distance(lat1, lng1, lat2, lng2) {
    var lat = [lat1, lat2];
    var lng = [lng1, lng2];
    var R = 6378137;
    var dLat = (lat[1] - lat[0]) * Math.PI / 180;
    var dLng = (lng[1] - lng[0]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d);
  },
  userCollect: function userCollect(is_collect, collect_id, obj_user_id, state) {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.wxrequest({
        url: is_collect ? useUrl.userCollectCancel : useUrl.userCollectSub,
        data: {
          user_id: that.gs('userInfoAll').id,
          obj_user_id: obj_user_id,
          collect_id: collect_id,
          state: state
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getEnum: function getEnum() {
    var that = this;
    this.wxrequest({
      url: that.getUrl().enum,
      data: {},
      success: function success(res) {
        if (res.data.status === 200) {
          that.data.label = res.data.data.label;
        }
      }
    });
  },
  getShareText: function getShareText() {
    var that = this;
    _cloud.getShareText().then(function (res) {
      that.su('shareText', res.result);
    });
    // wx.cloud.init({
    //   traceUser: true
    // })
    // wx.cloud.callFunction({
    //   name: 'getShareText',
    //   data: {},
    //   success (res) {
    //     that.su('shareText', res.result)
    //   },
    //   fail (err) {
    //     console.log(err)
    //   }
    // })
  },

  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function onLaunch() {
    var _this = this;

    this.getNavTab({});
    this.getEnum();
    setTimeout(function () {
      _this.getShareText();
    }, 500);
    // this.su('userInfoAll', {id:2, nickname: 'Edward2'})
    // this.getFont()
  },

  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function onShow() {
    // console.log(' ========== Application is showed ========== ')
  },
  onPageNotFound: function onPageNotFound() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function onHide() {
    this.su('first', 1);
    // console.log(' ========== Application is hid ========== ')
  }
});
//# sourceMappingURL=app.js.map
