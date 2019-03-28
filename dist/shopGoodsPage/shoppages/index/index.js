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
    selectAll: -1, // -2 全选中
    page: 0,
    list: [],
    all_Screen: app.data.all_screen,
    tabIndex: 0
  },
  inputas: function inputas(e) {
    this.setData({
      title: e.detail.value
    });
  },
  goEdit: function goEdit(e) {
    wx.navigateTo({
      url: this.data.list[e.currentTarget.dataset.index].parent_id * 1 === 0 ? '/releasePage/pageseleven/index/index?id=' + this.data.list[e.currentTarget.dataset.index].id : '/shopEditPage/shoppages/index/index?id=' + this.data.list[e.currentTarget.dataset.index].id + '&type=edit'
    });
  },
  tabChoose: function tabChoose(e) {
    this.data.list = [];
    this.data.page = 0;
    this.setData({
      tabIndex: e.currentTarget.dataset.index * 1
    }, this.setBar);
  },
  del: function del() {
    var newList = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.data.list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        if (!v['choose']) newList.push(v);
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

    this.setData({
      list: newList
    });
  },
  choose: function choose(e) {
    if (e.currentTarget.dataset.index < 0) this.checkAll();
    var that = this;
    var str = 'list[' + e.currentTarget.dataset.index + '].choose';
    this.setData(_defineProperty({}, str, !that.data.list[e.currentTarget.dataset.index].choose), that.checkAll);
  },
  checkAll: function checkAll(e) {
    var that = this;
    if (e) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.data.list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var v = _step2.value;

          v['choose'] = this.data.selectAll === -1;
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

      this.data.selectAll = this.data.selectAll === -1 ? -2 : -1;
    } else {
      this.data.selectAll = -2;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.data.list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _v = _step3.value;

          if (!_v['choose']) this.data.selectAll = -1;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    this.setData({
      list: that.data.list,
      selectAll: that.data.selectAll
    });
  },
  shopO: function shopO(e) {
    var that = this;
    var products = [];
    var temp = [];
    if (e.currentTarget.dataset.index >= 0) {
      products.push({ pid: that.data.list[e.currentTarget.dataset.index].id });
      that.data.list.splice(e.currentTarget.dataset.index, 1);
      temp = that.data.list;
    } else {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = that.data.list[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var v = _step4.value;

          if (v['choose']) products.push({ pid: v.id });else temp.push(v);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
    app.wxrequest({
      url: app.getUrl().shopDeal,
      data: {
        mid: app.gs('shopInfoAll').id,
        products: JSON.stringify(products),
        state: e.currentTarget.dataset.type === 'del' ? 3 : e.currentTarget.dataset.type === 'down' ? 2 : 1
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          wx.showToast({
            title: '操作成功'
          });
          that.setData({
            list: temp
          }, that.checkAll);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
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
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  search: function search(e) {
    this.data.title = e.detail.value ? e.detail.value : this.data.title;
    this.data.page = 0;
    this.data.list = [];
    this.getGoods();
  },
  getGoods: function getGoods() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopSale,
      data: {
        mid: app.gs('shopInfoAll').id,
        state: this.data.tabIndex * 1 + 1,
        page: ++that.data.page,
        title: this.data.title || ''
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = res.data.data.lists[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var v = _step5.value;

              v.create_time = app.momentFormat(v.create_time * 1000, 'MM月DD日 HH:mm');
              v.update_time = app.momentFormat(v.update_time * 1000, 'YYYY.MM.DD HH:mm:ss');
              v['stock'] = 0;
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = v.sku[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var s = _step6.value;

                  v['stock'] += s.stock * 1;
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

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
  setBar: function setBar() {
    if (this.data.tabIndex === 0) app.setBar('出售中的商品');else if (this.data.tabIndex === 1) app.setBar('仓库中的商品');else if (this.data.tabIndex === 2) app.setBar('库存紧张的商品');
    this.getGoods();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      tabIndex: options.type * 1
    }, this.setBar);

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
    if (this.data.more > 0) this.getGoods();else app.setToast(this, { content: '没有更多内容啦' });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    this.data.page = 0;
    this.data.list = [];
    this.data.title = '';
    this.getGoods();
    // TODO: onPullDownRefresh
  }
});