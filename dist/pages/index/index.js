'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 获取全局应用程序实例对象
var app = getApp();
var timer = null;
var bmap = require('../../utils/bmap-wx');
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    HEIGHT_TOP: app.data.HEIGHT_TOP,
    ALL_HEIGHT: app.data.ALL_HEIGHT,
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    page: 0,
    imgDomain: app.data.imgDomain,
    answerArr: [],
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    indicatorActiveColorVideo: '#dab866',
    show: true,
    tabNav: [
      // {
      //   title: '教学视频',
      //   type: 'navigate',
      //   url: '/coursePage/pageszero/course/course?type=1'
      // },
      // {
      //   title: '线下学习',
      //   type: 'navigate',
      //   url: '/offlinePage/pagesnine/courseOffline/courseOffline'
      // },
      // {
      //   title: '问答',
      //   type: 'navigate',
      //   url: '/answerPage/pagesthree/answer/answer'
      // },
      // {
      //   title: '教室入驻',
      //   type: 'navigate',
      //   url: '/answerPage/pagesthree/answer/answer'
      // }
    ]

  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },

  /**
   * 地址授权
   * @param e
   */
  open_site: function open_site(e) {
    console.log('setting');
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
    console.log('choose');
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

  /**
   * 百度地图函数
   * @param that
   * @constructor
   */
  Bmap: function Bmap(that, site) {
    // let _this = this
    var BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    });
    // BMap.weather({
    //   fail (data) {
    //     that.setData({
    //       openType: 'openSetting'
    //     })
    //     console.log('fail', data)
    //   },
    //   success (data) {
    //     let type = (new Date().getHours() > 18 || new Date().getHours() < 6) ? 'nightPictureUrl' : 'dayPictureUrl'
    //     that.setData({
    //       weatherInfo: data.originalData.results[0],
    //       weatherPic: data.originalData.results[0].weather_data[0][type].replace('http://', 'https://')
    //     })
    //   },
    //   location: site || null
    // }, _this)
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


  // 秒杀逻辑
  setKill: function setKill() {
    var that = this;
    if (timer) clearInterval(timer);
    function kill() {
      var shutDown = 0;
      // console.log(that.data.killArr)
      if (!that.data.killArr) return;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = that.data.killArr.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 1),
              i = _step$value[0];

          var nowData = new Date().getTime(); // 毫秒数
          // console.log('startTime', new Date(that.data.killArr[i].startTime))
          var startTime = that.data.killArr[i].start_time * 1000;
          var endTime = that.data.killArr[i].end_time * 1000;
          // console.log(nowData, startTime, endTime)
          if (nowData < startTime) {
            // 未开始
            that.data.killArr[i].status = 1;
            that.data.killArr[i].h = Math.floor((startTime - nowData) / 3600000);
            that.data.killArr[i].m = Math.floor((startTime - nowData) % 3600000 / 60000);
            that.data.killArr[i].s = Math.floor((startTime - nowData) % 60000 / 1000);
          } else if (nowData > startTime && nowData < endTime) {
            // 进行中
            that.data.killArr[i].status = 2;
            that.data.killArr[i].h = Math.floor((endTime - nowData) / 3600000);
            that.data.killArr[i].m = Math.floor((endTime - nowData) % 3600000 / 60000);
            that.data.killArr[i].s = Math.floor((endTime - nowData) % 60000 / 1000);
          } else {
            // 已结束
            if (that.data.killArr[i].status === 3) {
              ++shutDown;
              continue;
            }
            that.data.killArr[i].status = 3;
            that.data.killArr[i].h = '已';
            that.data.killArr[i].m = '结';
            that.data.killArr[i].s = '束';
          }
          that.setData({
            killArr: that.data.killArr
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

      if (shutDown === that.data.killArr.length) clearInterval(timer);
    }
    kill();
    timer = setInterval(function () {
      kill();
    }, 1000);
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
  onReachBottom: function onReachBottom() {},
  zan: function zan(e) {
    console.log(e);
    var that = this;
    app.wxrequest({
      url: app.getUrl().like,
      data: {
        obj_id: e.currentTarget.dataset.id,
        key: app.gs(),
        type: 0 // 0：专栏；1：文章；2：回答；3：视频；4：社群；5评论
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === 1) {
          that.data.indexData.columnArr[e.currentTarget.dataset.oindex][e.currentTarget.dataset.index].is_like = that.data.indexData.columnArr[e.currentTarget.dataset.oindex][e.currentTarget.dataset.index].is_like * 1 === 1 ? 0 : 1;
          that.data.indexData.column[e.currentTarget.dataset.oindex * 4 + e.currentTarget.dataset.index * 1].is_like = that.data.indexData.columnArr[e.currentTarget.dataset.oindex][e.currentTarget.dataset.index].is_like;
          that.setData({
            indexData: that.data.indexData
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  goOther: function goOther(e) {
    app.goOther(e);
  },
  getCourse: function getCourse() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().course,
      data: {
        page: 1
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var list = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = res.data.data.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var v = _step2.value;

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

          that.setData({
            list: list
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    var that = this;
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin();
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
    // this.setData({
    //   page: 0,
    //   answerArr: []
    // }, this.getIndexData)
    // console.log(' ---------- onPullDownRefresh ----------')
  }
});