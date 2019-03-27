'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    upImgArr: [],
    upImgArrProgress: []
  },
  shopUserReal: function shopUserReal() {
    var that = this;
    var temp = [];
    if (that.data.options.type !== 'user') {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = that.data.upImgArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          if (!v.real) return app.setToast(that, { content: '请等待图片上传完成' });
          temp.push(v.real);
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
    app.wxrequest({
      url: app.getUrl()[that.data.options.type === 'user' ? 'shopUserReal' : 'shopSet'],
      data: that.data.options.type === 'user' ? {
        uid: app.gs('userInfoAll').id,
        mall_rname: that.data.username
      } : {
        mid: app.gs('shopInfoAll').id || 10001,
        name: that.data.username,
        ad: temp.join(','),
        avatar: that.data.avatar
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var info = {};
          if (that.data.options.type === 'user') {
            info = app.gs('userInfoAll');
            info.mall_rname = that.data.username;
            app.su('userInfoAll', info);
          } else {
            info.avatar = that.data.avatar;
            info.name = that.data.username;
            app.su('shopInfoAll', info);
          }
          wx.showToast({
            title: '修改完成',
            mask: true
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 1400);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  inputName: function inputName(e) {
    if (e.detail.value.length <= 0) return app.setToast(this, { content: '请输入内容' });
    this.setData({
      username: e.detail.value
    });
  },
  change: function change() {
    var that = this;
    var id = app.gs('userInfoAll').id || 10000;
    wx.chooseImage({
      count: 1,
      success: function success(res) {
        that.data.avatar = '';
        that.data.percent = 0;
        var v = res.tempFilePaths[0];
        var Key = 'image/' + id + '/' + v.substr(v.lastIndexOf('/') + 1); // 这里指定上传的文件名
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: v,
          onProgress: function onProgress(info) {
            that.setData({
              percent: info.percent * 100
            });
          }
        }, function (err) {
          if (err) {
            wx.showModal({
              title: '上传失败',
              content: '请重新上传图片'
            });
          } else {
            that.setData({
              avatar: 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key
            }, function () {
              that.shopUserReal(that.data.username);
            });
          }
        });
      }
    });
  },
  wxUploadImg: function wxUploadImg() {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

    var that = this;
    var length = that.data.upImgArr.length || 0;
    var id = app.gs('userInfoAll').id || 10000;
    wx.chooseImage({
      count: index >= 0 ? 1 : 3 - length,
      success: function success(res) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = res.tempFilePaths.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                i = _step2$value[0],
                v = _step2$value[1];

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
              that.data.upImgArr[index >= 0 ? index : length + j]['upFail'] = true;
              that.setData({
                upImgArr: that.data.upImgArr
              });
            } else {
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
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.data.upImgArr[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var v = _step3.value;

        if (!v.real) itemList = ['查看图片', '替换图片'];
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
      avatar: app.gs('shopInfoAll').avatar,
      username: options.type === 'user' ? app.gs('userInfoAll').mall_rname : app.gs('shopInfoAll').name
    });
    if (options.type !== 'user') {
      var upImgArr = [];
      var upImgArrProgress = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = app.gs('shopInfoAll').ad.split(',')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var v = _step4.value;

          upImgArr.push({
            temp: v,
            key: v,
            real: v
          });
          upImgArrProgress.push(100);
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

      this.setData({
        upImgArr: upImgArr,
        upImgArrProgress: upImgArrProgress
      });
    }
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