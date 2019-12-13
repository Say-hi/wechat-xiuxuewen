'use strict';

// 获取全局应用程序实例对象
var app = getApp();
var proportion = wx.getSystemInfoSync().windowWidth / 750;
var HEIGHT = 100;
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    currentIndex: 0,
    height: HEIGHT,
    opacity: 1,
    videoTab: [{
      t: '热门提问'
    }, {
      t: '最新提问'
    }, {
      t: '我的提问'
    }],
    lists: []
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  getData: function getData() {
    this.getList();
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  chooseIndex: function chooseIndex(e) {
    this.data.page = 0;
    this.data.lists = [];
    try {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      }, this.getData);
    } catch (err) {
      this.setData({
        currentIndex: 2
      }, this.getData);
    }
  },
  onPageScroll: function onPageScroll(e) {
    var height = HEIGHT - e.scrollTop * proportion >= 100 ? 100 : HEIGHT - e.scrollTop * proportion;
    this.setData({
      height: height,
      opacity: height <= 0 ? 0 : height / HEIGHT
    });
  },
  getList: function getList(search) {
    var that = this;
    var data = {};
    if (search) {
      this.data.page = 0;
      this.data.lists = [];
      this.setData({
        currentIndex: -1,
        search: search
      });
      data = {
        // user_id: app.gs('userInfoAll').id,
        page: ++this.data.page,
        ask: search
      };
    } else if (this.data.currentIndex * 1 === 1) {
      data = {
        page: ++this.data.page
      };
    } else if (this.data.currentIndex * 1 === 2) {
      data = {
        user_id: app.gs('userInfoAll').id,
        page: ++this.data.page
      };
    } else {
      data = {
        page: ++this.data.page
      };
    }
    app.wxrequest({
      url: this.data.currentIndex * 1 === 1 || this.data.currentIndex * 1 === -1 ? app.getUrl().question : this.data.currentIndex * 1 === 0 ? app.getUrl().questionProblemHot : app.getUrl().questionProblemMy,
      data: data,
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              v.create_time = app.momentFormat(v.create_time * 1000, 'YYYY年MM月DD日 HH:mm:ss');
              v.images = v.images ? v.images.split(',') : [];
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
            lists: that.data.lists.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
          app.data.searchText = null;
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onReachBottom: function onReachBottom() {
    if (this.data.more) {
      if (this.data.search) {
        this.getList(this.data.search);
      } else {
        this.getList();
      }
    } else app.setToast(this, { content: '没有更多内容啦' });
  },
  getCount: function getCount() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().questionProblemMyCount,
      data: {
        user_id: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            hasInfo: res.data.data > 0 ? true : null
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onLoad: function onLoad() {
    this.getList();
  },
  onReady: function onReady() {
    // TODO: onReady
  },
  onShow: function onShow() {
    if (app.data.searchText) this.getList(app.data.searchText);
    this.getCount();
    // TODO: onShow
  },
  onHide: function onHide() {
    // TODO: onHide
  },
  onUnload: function onUnload() {
    // TODO: onUnload
  },
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});