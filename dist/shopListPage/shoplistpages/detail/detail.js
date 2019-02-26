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
    num: 1,
    img: app.data.testImg,
    specifi: [{
      t: 'color',
      chooses: [{
        t: '可可棕',
        id: 1
      }, {
        t: '可可棕',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }]
  },
  goSubmit: function goSubmit() {
    wx.navigateTo({
      url: '../submit/submit'
    });
  },
  buy: function buy(e) {
    this.setData({
      buyMask: !this.data.buyMask
    });
  },
  noUse: function noUse() {
    app.noUse();
  },
  numOperation: function numOperation(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (type === 'add') {
      this.setData({
        num: ++this.data.num
      });
    } else {
      if (this.data.num <= 1) return;
      this.setData({
        num: --this.data.num
      });
    }
  },
  chooseSp: function chooseSp(e) {
    var that = this;
    var _e$currentTarget$data = e.currentTarget.dataset,
        oindex = _e$currentTarget$data.oindex,
        index = _e$currentTarget$data.index;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = that.data.specifi[oindex].chooses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        v['choose'] = false;
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

    that.data.specifi[oindex].chooses[index]['choose'] = true;
    var setStr = 'specifi[' + oindex + ']';
    this.setData(_defineProperty({}, setStr, that.data.specifi[oindex]));
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
//# sourceMappingURL=detail.js.map
