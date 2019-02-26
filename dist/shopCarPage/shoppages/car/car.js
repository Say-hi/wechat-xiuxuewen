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
    totalMoney: 0,
    totalCount: 0,
    img: app.data.testImg,
    list: [{
      num: 1,
      price: '22.00',
      image: app.data.testImg,
      title: '我是视频标题我是视频标题我是视频标题'
    }, {
      num: 1,
      price: '222.00',
      image: app.data.testImg,
      title: '我是视频标题'
    }, {
      num: 1,
      price: '22.00',
      image: app.data.testImg,
      title: '我是视频标题我是视频标题我是视频标题'
    }, {
      num: 1,
      price: '222.00',
      image: app.data.testImg,
      title: '我是视频标题'
    }, {
      num: 1,
      price: '22.00',
      image: app.data.testImg,
      title: '我是视频标题我是视频标题我是视频标题'
    }, {
      num: 1,
      price: '222.00',
      image: app.data.testImg,
      title: '我是视频标题'
    }]
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
  edit: function edit() {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.data.list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var v = _step2.value;

        v['choose'] = false;
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
    var str = 'list[' + e.currentTarget.dataset.index + '].num';
    if (type === 'add') {
      ++that.data.list[e.currentTarget.dataset.index].num;
    } else {
      if (that.data.list[e.currentTarget.dataset.index].num <= 1) return;
      --that.data.list[e.currentTarget.dataset.index].num;
    }
    this.setData(_defineProperty({}, str, that.data.list[e.currentTarget.dataset.index].num), that.calculate);
  },
  checkAll: function checkAll(e) {
    var that = this;
    if (e) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.data.list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var v = _step3.value;

          v['choose'] = this.data.selectAll === -1;
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

      this.data.selectAll = this.data.selectAll === -1 ? -2 : -1;
    } else {
      this.data.selectAll = -2;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.data.list[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _v = _step4.value;

          if (!_v['choose']) this.data.selectAll = -1;
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
    this.setData({
      list: that.data.list,
      selectAll: that.data.selectAll
    }, that.calculate);
  },
  calculate: function calculate() {
    var totalMoney = 0;
    var totalCount = 0;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = this.data.list[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var v = _step5.value;

        if (v['choose']) {
          totalMoney += v.price * v.num;
          totalCount += v.num * 1;
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

    this.setData({
      totalMoney: totalMoney,
      totalCount: totalCount
    });
  },
  submit: function submit() {
    wx.navigateTo({
      url: '/shopListPage/shoplistpages/submit/submit'
    });
  },
  noUse: function noUse() {
    app.noUse();
  },
  playVideo: function playVideo(e) {
    var that = this;
    this.setData({
      play: !that.data.play,
      playIndex: e.currentTarget.dataset.index
    });
  },
  onShareAppMessage: function onShareAppMessage() {
    var that = this;
    return {
      title: '' + (that.data.info.share_title || '邀请您入驻绣学问，成为优秀的纹绣人'),
      imageUrl: '' + (that.data.info.share_imageUrl || ''),
      path: '/enteringPage/pagestwelve/entering/entering?id=' + app.gs('userInfoAll').id
    };
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
//# sourceMappingURL=car.js.map
