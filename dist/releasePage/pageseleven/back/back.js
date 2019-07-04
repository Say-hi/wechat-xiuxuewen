'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
var COS = require('../cos-js-sdk-v5.min');
var config = require('../config');
var cos = new COS({
  getAuthorization: function getAuthorization(params, callback) {
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});
var UpLoad = require('../upLoad');
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    backType: [{
      t: '我要退款（无需退货）'
    }, {
      t: '我要退货退款'
    }],
    backTypeIndex: 0,
    backReason: [{
      t: '多拍、错拍、不想要'
    }, {
      t: '不喜欢、效果不好'
    }, {
      t: '货物与描述不符'
    }, {
      t: '质量问题'
    }, {
      t: '收到商品少件、破损与污渍'
    }, {
      t: '卖家发错货'
    }, {
      t: '假冒品牌'
    }],
    backReasonIndex: 0,
    upImgArr: [],
    upImgArrProgress: []
  },
  refund: function refund() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().refund,
      data: {
        uid: app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid,
        mid: that.data.options.mid,
        oid: that.data.options.oid,
        amount: that.data.options.amount || 0,
        out_trade_no: that.data.options.out_trade_no,
        types: that.data.backTypeIndex * 1 + 1,
        reason: that.data.backReason[that.data.backReasonIndex].t,
        explain: that.data.content || '顾客未填写说明'
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            apply: true
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  inputValue: function inputValue(e) {
    app.inputValue(e, this);
  },
  pickerChange: function pickerChange(e) {
    // console.log(e)
    this.setData(_defineProperty({}, '' + e.currentTarget.dataset.type, e.detail.value));
  },
  wxUploadImg: function wxUploadImg() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

    var that = this;
    var length = that.data.upImgArr.length || 0;
    var id = app.gs('userInfoAll').id || 10000;
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success: function success(res) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = res.tempFilePaths.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                i = _step$value[0],
                v = _step$value[1];

            if (!that.data.upImgArr[index >= 0 ? index : length + i]) {
              that.data.upImgArr[index >= 0 ? index : length + i] = {
                temp: null,
                real: null
              };
            }
            that.data.upImgArr[index >= 0 ? index : length + i]['real'] = '';
            that.data.upImgArr[index >= 0 ? index : length + i]['temp'] = v;
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
          upImgArr: that.data.upImgArr
        });
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr[index].Key
          });
        }
        (function upLoad(j) {
          var v = res.tempFilePaths[j];
          var Key = 'image/' + id + '/' + v.substr(v.lastIndexOf('/') + 1); // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function onProgress(info) {
              that.data.upImgArrProgress[index >= 0 ? index : length + j] = info.percent * 100;
              that.setData({
                upImgArrProgress: that.data.upImgArrProgress
              });
            }
          }, function (err, data) {
            if (err) {
              console.error('upLoadErr', err);
              that.data.upImgArr[index >= 0 ? index : length + j]['upFail'] = true;
              that.setData({
                upImgArr: that.data.upImgArr
              });
            } else {
              console.log(data);
              that.data.upImgArr[index >= 0 ? index : length + j]['real'] = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key;
              that.data.upImgArr[index >= 0 ? index : length + j]['Key'] = Key;
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1);
          });
        })(0);
      }
    });
  },
  imgOperation: function imgOperation(e) {
    if (!this.data.upImgArr[e.currentTarget.dataset.index].real) return app.setToast(this, { content: '请稍后操作' });
    var that = this;
    var itemList = ['查看图片', '替换图片', '删除图片'];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.data.upImgArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var v = _step2.value;

        if (!v.real) itemList = ['查看图片', '替换图片'];
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

    wx.showActionSheet({
      itemList: itemList,
      success: function success(res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr[e.currentTarget.dataset.index].temp, [that.data.upImgArr[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr[e.currentTarget.dataset.index].Key
          }, function () {
            that.data.upImgArr.splice(e.currentTarget.dataset.index, 1);
            that.setData({
              upImgArr: that.data.upImgArr
            });
          });
        } else if (res.tapIndex === 1) {
          that.wxUploadImg(e.currentTarget.dataset.index);
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
  onLoad: function onLoad(options) {
    this.setData({
      options: options,
      apply: options.apply * 1 === 1
    });
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