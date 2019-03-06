'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 获取全局应用程序实例对象
var app = getApp();
var COS = require('../cos-js-sdk-v5.min.js');
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
    compressd: true,
    tipsArr: [{
      t: 'asdf'
    }, {
      t: '啊撒旦看风景'
    }],
    testImg: app.data.testImg,
    upImgArr: [],
    upImgArrProgress: [],
    content: 0
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  inputValue: function inputValue(e) {
    this.setData({
      content: e.detail.value
    });
  },
  chooseTip: function chooseTip(e) {
    this.data.tipsArr[e.currentTarget.dataset.index]['choose'] = !this.data.tipsArr[e.currentTarget.dataset.index]['choose'];
    this.setData({
      tipsArr: this.data.tipsArr
    });
  },

  // 上传图片
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
  compress: function compress() {
    this.setData({
      compressd: !this.data.compressd
    });
  },
  upVideo: function upVideo() {
    var that = this;
    this.setData({
      speed: null,
      upText: '等待上传',
      size: 0,
      duration: 0,
      time: '等待上传任务结束'
    });
    var start = new Date().getTime();
    wx.chooseVideo({
      compressed: that.data.compressd,
      success: function success(res) {
        console.log('chooseSuccess', res);
        that.setData({
          duration: res.duration,
          size: res.size / 1024 > 1024 ? res.size / 1024 / 1024 + 'M' : res.size / 1024 + 'KB'
        });
        var v = res.tempFilePath;
        var Key = 'video/10000/' + v.substr(v.lastIndexOf('/') + 1);
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: v,
          onProgress: function onProgress(info) {
            that.setData({
              upText: '上传中',
              speed: info.speed / 1024 > 1024 ? info.speed / 1024 / 1024 + 'M/s' : info.speed / 1024 + 'KB/s'
            });
          }
        }, function (err, data) {
          that.setData({
            time: (new Date().getTime() - start) / 1000
          });
          if (err) {
            console.error('upLoadErr', err);
            that.setData({
              upText: '失败'
            });
          } else {
            console.log('data', data);
            that.setData({
              upText: '成功'
            });
          }
        });
      }
    });
  },

  // 图片操作
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
  release: function release() {
    var that = this;
    if (!this.data.content) return app.setToast(this, { content: '请输入您的提问内容' });
    var images = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.data.upImgArr[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var v = _step3.value;

        images.push(v.real);
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

    app.wxrequest({
      url: app.getUrl().questionProblemSub,
      data: {
        user_id: app.gs('userInfoAll').id,
        context: that.data.content,
        images: images.join(',')
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          wx.showToast({
            title: '发布成功',
            mask: true
          });
          setTimeout(function () {
            wx.navigateBack({});
          }, 1000);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      options: options
    });
    app.setBar(options.type || '发布问题');
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
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});