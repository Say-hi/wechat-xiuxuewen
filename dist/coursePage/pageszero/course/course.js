'use strict';

// 获取全局应用程序实例对象
var app = getApp();
var page = 0;
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabNav: app.data.label,
    lists: [],
    page: 0,
    currentIndex: 0
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  chooseIndex: function chooseIndex(e) {
    app.setBar(e.currentTarget.dataset.text);
    this.data.lists = [];
    this.data.page = 0;
    page = 0;
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    }, this.getList);
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
  },
  getOfflineList: function getOfflineList() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().activeNearby,
      data: {
        label: app.data.label[that.data.currentIndex].label,
        longitude: that.data.options.lng,
        latitude: that.data.options.lat,
        code: that.data.options.adcode,
        parent_code: that.data.parent_code ? 1 : 0,
        pages: ++this.data.page
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (res.data.data.total < 1 && !that.data.parent_code) {
            that.data.parent_code = 1;
            that.data.page <= 1 ? that.data.page = 0 : null;
            that.getOfflineList();
          } else {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = res.data.data.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var v = _step.value;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = v.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var s = _step2.value;

                    s.distance = s.distance > 1000 ? (s.distance / 1000).toFixed(2) + 'km' : s.distance + 'm';
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
              lists: res.data.data.lists
            });
          }
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  getList: function getList() {
    if (this.data.privice === 'noneed') return;
    if (this.data.options.type * 1 === 2) return this.getOfflineList();
    var that = this;
    app.wxrequest({
      url: that.data.options.type === 'search' ? app.getUrl().courseSearch : app.getUrl().course,
      data: that.data.options.type === 'search' ? {
        page: ++page,
        title: that.data.searchText,
        user_id: app.gs('userInfoAll').id || null
      } : {
        label: app.data.label[that.data.currentIndex].label,
        page: ++page,
        user_id: app.gs('userInfoAll').id || null
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            lists: that.data.lists.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onReachBottom: function onReachBottom() {
    if (this.data.more >= 1) this.getList();else app.setToast(this, { content: '没有更多内容啦' });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    if (app.data.searchText) {
      this.data.searchText = app.data.searchText;
      app.data.searchText = null;
    }
    app.setBar(options.type === 'search' ? '搜索课程' : app.data.label[0].t);
    page = 0;
    
    var that = this;
    app.cloud().getMoney().then(function (res) {
      that.setData({
        options: options,
        tabNav: app.data.label,
        privice: res.privice
      }, that.getList);
    })
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
    this.data.lists = [];
    page = 0;
    this.getList();
    // TODO: onPullDownRefresh
  }
});