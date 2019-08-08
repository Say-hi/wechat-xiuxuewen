'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 0
  },
  inputValue: function inputValue(e) {
    this.data.searchText = e.detail.value;
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
  getList: function getList() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().pinlist,
      // url: app.getUrl().shopProductList,
      data: {
        mid: app.gs('shopInfoAll').id,
        page: ++that.data.page
      },
      success: function success(res) {
        if (that.data.page === 1) wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.status === 200) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              v.price = v.price.split('.');
              // v.price = v.old_price.split('.')
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
            list: that.data.list.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onReachBottom: function onReachBottom() {
    if (this.data.more > 0) this.getList();else app.setToast(this, { content: '没有更多内容啦' });
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.getList();
    this.getPinPic();
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
    this.data.list = [];
    this.data.page = 0;
    this.getList();
  }
});