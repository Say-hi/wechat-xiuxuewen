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
    selectAll: -1, // -2 全选中
    totalMoney: 0,
    totalCount: 0,
    all_screen: app.data.all_screen,
    discount_name: app.gs('shopInfoAll').discount_name,
    discount_value: app.gs('shopInfoAll').discount_value
  },
  getCar: function getCar() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopCartList,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var noMean = [];
          var list = [];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              if (v.count * 1 > v.stock) v.count = v.stock;
              if (v.is_unchange * 1 !== 1) {
                noMean.push(v);
              } else {
                v.price = (1 * v.price).toFixed(2);
                list.push(v);
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
            list: list,
            noMean: noMean
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  del: function del() {
    var newList = [];
    this.data.del = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.data.list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var v = _step2.value;

        if (!v['choose']) newList.push(v);else this.data.del.push({ id: v.id });
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

    this.setData({
      list: newList
    }, this.delCar);
  },
  delCar: function delCar() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopCartDelete,
      data: {
        uid: app.gs('userInfoAll').id,
        cart_id: JSON.stringify(that.data.del)
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.del = [];
        } else {
          app.setToast(that, { content: res.data.desc });
          that.getCar();
        }
      }
    });
  },
  delOne: function delOne(e) {
    this.data.del = [{ id: this.data.noMean[e.currentTarget.dataset.index].id }];
    this.data.noMean.splice(e.currentTarget.dataset.index, 1);
    this.delCar();
    this.setData({
      noMean: this.data.noMean
    });
  },
  edit: function edit() {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.data.list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var v = _step3.value;

        v['choose'] = false;
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

    this.setData({
      list: this.data.list,
      selectAll: -1,
      del: !this.data.del,
      totalMoney: 0,
      totalCount: 0
    });
  },
  choose: function choose(e) {
    if (e.currentTarget.dataset.index < 0) this.checkAll();
    var that = this;
    var str = 'list[' + e.currentTarget.dataset.index + '].choose';
    this.setData(_defineProperty({}, str, !that.data.list[e.currentTarget.dataset.index].choose), that.checkAll);
  },
  numOperation: function numOperation(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var before = that.data.list[e.currentTarget.dataset.index].count;
    if (type === 'add') {
      if (that.data.list[e.currentTarget.dataset.index].count * 1 >= that.data.list[e.currentTarget.dataset.index].stock) return app.setToast(that, { content: '没有更多的库存啦' });
      ++that.data.list[e.currentTarget.dataset.index].count;
    } else {
      if (that.data.list[e.currentTarget.dataset.index].count <= 1) return;
      --that.data.list[e.currentTarget.dataset.index].count;
      if (that.data.list[e.currentTarget.dataset.index].count > that.data.list[e.currentTarget.dataset.index].stock) that.data.list[e.currentTarget.dataset.index].count = that.data.list[e.currentTarget.dataset.index].stock;
    }
    this.changeCount(e, before);
    // this.setData({
    //   [str]: that.data.list[e.currentTarget.dataset.index].count
    // }, that.calculate)
  },
  checkAll: function checkAll(e) {
    var that = this;
    if (e) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.data.list[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var v = _step4.value;

          v['choose'] = this.data.selectAll === -1;
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

      this.data.selectAll = this.data.selectAll === -1 ? -2 : -1;
    } else {
      this.data.selectAll = -2;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.data.list[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _v = _step5.value;

          if (!_v['choose']) this.data.selectAll = -1;
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
    }
    this.setData({
      list: that.data.list,
      selectAll: that.data.selectAll
    }, that.calculate);
  },
  calculate: function calculate() {
    var totalMoney = 0;
    var totalCount = 0;
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = this.data.list[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var v = _step6.value;

        if (v['choose']) {
          totalMoney += v.price * v.count;
          totalCount += v.count * 1;
        }
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

    this.setData({
      totalMoney: totalMoney.toFixed(2),
      totalCount: totalCount
    });
  },
  submit: function submit() {
    var temp = [];
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = this.data.list[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var v = _step7.value;

        if (v['choose']) temp.push(v);
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    app.su('buyInfo', temp);
    wx.navigateTo({
      url: '/shopListPage/shoplistpages/submit/submit?type=car'
    });
  },
  changeCount: function changeCount(e, before) {
    var that = this;
    var str = 'list[' + e.currentTarget.dataset.index + '].count';
    app.wxrequest({
      url: app.getUrl().shopCartChange,
      data: {
        cid: that.data.list[e.currentTarget.dataset.index].id,
        uid: app.gs('userInfoAll').id,
        count: that.data.list[e.currentTarget.dataset.index].count
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData(_defineProperty({}, str, that.data.list[e.currentTarget.dataset.index].count), that.calculate);
        } else {
          that.data.list[e.currentTarget.dataset.index].count = before;
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {

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
    this.setData({
      selectAll: -1,
      totalMoney: 0,
      totalCount: 0
    });
    this.getCar();
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