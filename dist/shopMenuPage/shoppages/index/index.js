'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lists: [{
      t: '你说什么这里是第一行啊',
      y: 0,
      s: 0
    }, {
      t: 'asdf是第2行啊',
      y: 40,
      s: 1
    }, {
      t: '123123是第3行啊',
      y: 80,
      s: 2
    }, {
      t: 'zzzzzzzzz这里是第4行啊',
      y: 120,
      s: 3
    }, {
      t: 'aaaaa这里是5啊',
      y: 160,
      s: 4
    }],
    step: 40,
    move_index: -1,
    Y: -1
  },
  tap: function tap() {
    console.log('tap');
  },
  start: function start(e) {
    this.setData({
      animation: true,
      move_index: this.data.lists[e.currentTarget.dataset.index].s * 1
    });
    this.data.Y = this.data.lists[e.currentTarget.dataset.index].s * 1;
  },
  movechange: function movechange(e) {
    if (e.detail.source === 'touch') {
      var change = Math.floor(e.detail.y / this.data.step);
      if (this.data.Y === change) return;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.data.lists.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              i = _step$value[0],
              v = _step$value[1];

          if (v.s === change) {
            var temp2 = this.data.lists[this.data.move_index].y;
            this.data.lists[this.data.move_index].y = this.data.lists[i].y;
            this.setData(_defineProperty({}, 'lists[' + i + '].y', temp2));
            var temp = this.data.lists[i].s;
            this.data.lists[i].s = this.data.lists[this.data.move_index].s;
            this.data.lists[this.data.move_index].s = temp;
            this.data.Y = change;
            return;
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
    }
  },
  end: function end() {
    this.setData({
      animation: false
    });
    var that = this;
    this.data.Y = -1;
    var s = that.data.lists.sort(function (a, b) {
      return a.y - b.y;
    });
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = s.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _step2$value = _slicedToArray(_step2.value, 2),
            i = _step2$value[0],
            v = _step2$value[1];

        v.s = i;
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
      lists: s,
      move_index: -1
    });
  },
  longpress: function longpress(e) {
    this.setData({
      long_index: e.currentTarget.dataset.index,
      long_mask: true
    });
  },
  btnChoose: function btnChoose(e) {
    if (!e.detail.value.tx) return app.setToast(this, { content: '请输入内容' });
    if (e.detail.target.dataset.type === 'confirm') {
      this.setData(_defineProperty({}, 'lists[' + this.data.long_index + '].t', e.detail.value.tx));
    }
    this.setData({
      long_mask: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {},


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {},


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {}
});