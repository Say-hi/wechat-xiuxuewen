'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'searchHistory',
    keyWord: [1, 23, 4],
    searchShow: true
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  getKey: function getKey() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().homeSearch,
      data: {},
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            keyWord: res.data.data[that.data.options.type]
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  cleanHistory: function cleanHistory() {
    this.setData({
      history: [],
      searchShow: false
    });
    if (this.data.options.type === 'goods') {
      wx.removeStorageSync('goodsHistory');
    } else {
      wx.removeStorageSync('articleHistory');
    }
  },
  chooseTip: function chooseTip(e) {
    var index = e.currentTarget.dataset.choose;
    if (e.currentTarget.dataset.type === 'key') {
      this.setData({
        keyWordIndex: index
      }, this.search(e.currentTarget.dataset.content));
    } else {
      this.setData({
        chooseHistory: index
      }, this.search(e.currentTarget.dataset.content));
    }
  },
  search: function search(content) {
    // return
    var that = this;
    // console.log(content)
    var searcheText = '';
    if (content.detail) searcheText = content.detail.value;else searcheText = content;
    app.wxrequest({
      url: that.data.options.type === 'question' ? app.getUrl().question : that.data.options.type === 'store' ? app.getUrl().dotSearch : that.data.options.type === 'course' ? app.getUrl().courseSearch : that.data.options.type === 'offline' ? app.getUrl().activeSearch : '',
      data: Object.assign({
        page: 1
      }, that.data.options.type === 'question' ? { ask: searcheText } : that.data.options.type === 'store' ? { dot_name: searcheText } : that.data.options.type === 'course' || that.data.options.type === 'offline' ? { title: searcheText } : {}),
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200 && res.data.data.total > 0) {
          app.data.searchText = searcheText;
          setTimeout(function () {
            that.data.options.type === 'course' ? wx.navigateTo({
              url: '/coursePage/pageszero/course/course?type=search'
            }) : wx.navigateBack();
          }, 20);
        } else {
          app.setToast(that, { content: '未搜索到相关内容' });
        }
      }
    });
    // 设置缓存
    for (var index in that.data.history) {
      // 搜索项已经存在
      if (that.data.history[index] === searcheText) {
        // console.log(index)
        that.setData({
          chooseHistory: index
        });
        // that.getSearch(that.data.history[index])
        return;
      }
    }
    var history = that.data.history;
    // console.log(history)
    if (!history) {
      history = [searcheText];
      that.data.history = history;
    } else {
      var count = history.unshift(searcheText);
      if (count >= 10) {
        that.data.history.pop();
      }
    }
    this.setData({
      chooseHistory: 0,
      searchShow: true
    });
    // 执行搜索操作
    // this.getSearch(searcheText)
    var type = that.data.options.type === 'goods' ? 'goodsHistory' : 'articleHistory';
    wx.setStorage({
      key: type,
      data: that.data.history,
      success: function success() {
        that.setData({
          history: wx.getStorageSync(type)
        });
      }
    });
  },
  getHot: function getHot() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().search,
      data: {},
      success: function success(res) {
        wx.hideLaoding();
        if (res.data.status === 200) {} else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    app.setBar('搜索');
    // app.getSelf(this)
    var history = options.type === 'goods' ? app.gs('goodsHistory') : app.gs('articleHistory');
    if (!history) {
      this.setData({
        searchShow: false
      });
    }
    this.setData({
      options: options,
      history: history || []
    }, this.getKey);
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
    // TODO: onPullDownRefresh
  }
});