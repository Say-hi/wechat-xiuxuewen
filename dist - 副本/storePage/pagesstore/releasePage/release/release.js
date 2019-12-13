'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 获取全局应用程序实例对象
var app = getApp();
var COS = require('../cos-js-sdk-v5.min.js');
var config = require('../config');
var bmap = require('../../../../utils/bmap-wx');
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
    userAddress: {
      address: '选择地址定位'
    },
    openType: '',
    tipsArr: [{
      t: 'asdf'
    }, {
      t: '啊撒旦看风景'
    }],
    labelIndex: -1,
    labelArr: ['富力天域', '十年纹绣', 'ID品牌'],
    testImg: app.data.testImg,
    upImgArr: [],
    upImgArrProgress: [],
    upImgArr3: [],
    upImgArrProgress3: [],
    upImgArr4: [],
    upImgArrProgress4: [],
    upImgArr5: [],
    upImgArrProgress5: [],
    upImgArr6: [],
    upImgArrProgress6: [],
    content: 0
  },
  Bmap: function Bmap(that, site) {
    var BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    });
    BMap.regeocoding({
      location: site || null,
      success: function success(res) {
        that.data.addressInfo = res;
      },
      fail: function fail(data) {
        console.log('fail', data);
      }
    });
  },

  // 多图上传
  upImg2: function upImg2(index) {
    var imgArr = 'upImgArr3';
    var progressArr = 'upImgArrProgress3';
    var that = this;
    var length = that.data[imgArr].length || 0;
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

            if (!that.data[imgArr][index >= 0 ? index : length + i]) {
              that.data[imgArr][index >= 0 ? index : length + i] = {
                temp: null,
                real: null
              };
            }
            that.data[imgArr][index >= 0 ? index : length + i]['real'] = '';
            that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v;
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
          upImgArr3: that.data[imgArr]
        });
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data[imgArr][index].Key
        //   })
        // }
        function noUse() {}
        (function upLoad(j) {
          var v = res.tempFilePaths[j];
          var Key = 'image/' + id + '/' + v.substr(v.lastIndexOf('/') + 1); // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function onProgress(info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100;
              that.setData({
                upImgArrProgress3: that.data[progressArr]
              });
            }
          }, function (err, data) {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true;
              that.setData({
                upImgArr3: that.data[imgArr]
              });
            } else {
              console.log(data);
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key;
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key;
              that.setData({
                upImgArr3: that.data[imgArr]
              });
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1);
          });
        })(0);
      }
    });
  },

  // 图片操作
  imgOperation: function imgOperation(e) {
    if (!this.data.upImgArr3[e.currentTarget.dataset.index].real) return app.setToast(this, { content: '请稍后操作' });
    var that = this;
    var itemList = ['查看图片', '替换图片', '删除图片'];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.data.upImgArr3[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
          app.showImg(that.data.upImgArr3[e.currentTarget.dataset.index].temp, [that.data.upImgArr3[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
          // cos.deleteObject({
          //   Bucket: config.Bucket,
          //   Region: config.Region,
          //   Key: that.data.upImgArr3[e.currentTarget.dataset.index].Key
          // }, () => {
          //
          // })
          that.data.upImgArr3.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upImgArr3: that.data.upImgArr3
          });
        } else if (res.tapIndex === 1) {
          that.upImg2(e.currentTarget.dataset.index);
        }
      }
    });
  },

  // 多图上传
  upImg3: function upImg3(index) {
    var imgArr = 'upImgArr4';
    var progressArr = 'upImgArrProgress4';
    var that = this;
    var length = that.data[imgArr].length || 0;
    var id = app.gs('userInfoAll').id || 10000;
    wx.chooseImage({
      count: index >= 0 ? 1 : 2 - length,
      success: function success(res) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = res.tempFilePaths.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _slicedToArray(_step3.value, 2),
                i = _step3$value[0],
                v = _step3$value[1];

            if (!that.data[imgArr][index >= 0 ? index : length + i]) {
              that.data[imgArr][index >= 0 ? index : length + i] = {
                temp: null,
                real: null
              };
            }
            that.data[imgArr][index >= 0 ? index : length + i]['real'] = '';
            that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v;
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

        that.setData({
          upImgArr4: that.data[imgArr]
        });
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data[imgArr][index].Key
        //   })
        // }
        function noUse() {}
        (function upLoad(j) {
          var v = res.tempFilePaths[j];
          var Key = 'image/' + id + '/' + v.substr(v.lastIndexOf('/') + 1); // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function onProgress(info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100;
              that.setData({
                upImgArrProgress4: that.data[progressArr]
              });
            }
          }, function (err, data) {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true;
              that.setData({
                upImgArr4: that.data[imgArr]
              });
            } else {
              console.log(data);
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key;
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key;
              that.setData({
                upImgArr4: that.data[imgArr]
              });
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1);
          });
        })(0);
      }
    });
  },

  // 图片操作
  imgOperation2: function imgOperation2(e) {
    if (!this.data.upImgArr4[e.currentTarget.dataset.index].real) return app.setToast(this, { content: '请稍后操作' });
    var that = this;
    var itemList = ['查看图片', '替换图片', '删除图片'];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = this.data.upImgArr4[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var v = _step4.value;

        if (!v.real) itemList = ['查看图片', '替换图片'];
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

    wx.showActionSheet({
      itemList: itemList,
      success: function success(res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr4[e.currentTarget.dataset.index].temp, [that.data.upImgArr4[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
          // cos.deleteObject({
          //   Bucket: config.Bucket,
          //   Region: config.Region,
          //   Key: that.data.upImgArr4[e.currentTarget.dataset.index].Key
          // }, () => {
          //
          // })
          that.data.upImgArr4.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upImgArr4: that.data.upImgArr4
          });
        } else if (res.tapIndex === 1) {
          that.upImg3(e.currentTarget.dataset.index);
        }
      }
    });
  },

  // 多图上传
  upImg4: function upImg4(index) {
    var imgArr = 'upImgArr5';
    var progressArr = 'upImgArrProgress5';
    var that = this;
    var length = that.data[imgArr].length || 0;
    var id = app.gs('userInfoAll').id || 10000;
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success: function success(res) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = res.tempFilePaths.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _step5$value = _slicedToArray(_step5.value, 2),
                i = _step5$value[0],
                v = _step5$value[1];

            if (!that.data[imgArr][index >= 0 ? index : length + i]) {
              that.data[imgArr][index >= 0 ? index : length + i] = {
                temp: null,
                real: null
              };
            }
            that.data[imgArr][index >= 0 ? index : length + i]['real'] = '';
            that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v;
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
          upImgArr5: that.data[imgArr]
        });
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data[imgArr][index].Key
        //   })
        // }
        function noUse() {}
        (function upLoad(j) {
          var v = res.tempFilePaths[j];
          var Key = 'image/' + id + '/' + v.substr(v.lastIndexOf('/') + 1); // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function onProgress(info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100;
              that.setData({
                upImgArrProgress5: that.data[progressArr]
              });
            }
          }, function (err, data) {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true;
              that.setData({
                upImgArr5: that.data[imgArr]
              });
            } else {
              console.log(data);
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key;
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key;
              that.setData({
                upImgArr5: that.data[imgArr]
              });
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1);
          });
        })(0);
      }
    });
  },

  // 图片操作
  imgOperation3: function imgOperation3(e) {
    if (!this.data.upImgArr5[e.currentTarget.dataset.index].real) return app.setToast(this, { content: '请稍后操作' });
    var that = this;
    var itemList = ['查看图片', '替换图片', '删除图片'];
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = this.data.upImgArr5[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var v = _step6.value;

        if (!v.real) itemList = ['查看图片', '替换图片'];
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

    wx.showActionSheet({
      itemList: itemList,
      success: function success(res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr5[e.currentTarget.dataset.index].temp, [that.data.upImgArr5[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
          // cos.deleteObject({
          //   Bucket: config.Bucket,
          //   Region: config.Region,
          //   Key: that.data.upImgArr5[e.currentTarget.dataset.index].Key
          // }, () => {
          //
          // })
          that.data.upImgArr5.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upImgArr5: that.data.upImgArr5
          });
        } else if (res.tapIndex === 1) {
          that.upImg4(e.currentTarget.dataset.index);
        }
      }
    });
  },

  // 门店头像上传
  upImg5: function upImg5() {
    if (this.data.upImgArr6.length >= 1 && !this.data.upImgArr6[0].real) return app.setToast(this, { content: '请等待上传完毕' });
    var index = 0;
    var imgArr = 'upImgArr6';
    var progressArr = 'upImgArrProgress6';
    var that = this;
    var length = that.data[imgArr].length || 0;
    var id = app.gs('userInfoAll').id || 10000;
    wx.chooseImage({
      count: 1,
      success: function success(res) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = res.tempFilePaths.entries()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _step7$value = _slicedToArray(_step7.value, 2),
                i = _step7$value[0],
                v = _step7$value[1];

            if (!that.data[imgArr][index >= 0 ? index : length + i]) {
              that.data[imgArr][index >= 0 ? index : length + i] = {
                temp: null,
                real: null
              };
            }
            that.data[imgArr][index >= 0 ? index : length + i]['real'] = '';
            that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v;
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

        that.setData({
          upImgArr6: that.data[imgArr]
        });
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data[imgArr][index].Key
        //   })
        // }
        function noUse() {}
        (function upLoad(j) {
          var v = res.tempFilePaths[j];
          var Key = 'image/' + id + '/' + v.substr(v.lastIndexOf('/') + 1); // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function onProgress(info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100;
              that.setData({
                upImgArrProgress6: that.data[progressArr]
              });
            }
          }, function (err, data) {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true;
              that.setData({
                upImgArr6: that.data[imgArr]
              });
            } else {
              console.log(data);
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key;
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key;
              that.setData({
                upImgArr6: that.data[imgArr]
              });
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1);
          });
        })(0);
      }
    });
  },
  upno: function upno() {
    app.setToast(this, { content: '图片上传中，请稍后操作' });
  },

  // 选择地址
  address: function address() {
    var that = this;
    wx.getSetting({
      success: function success(res) {
        // 用户未授权
        if (!res.authSetting['scope.userLocation']) {
          console.log(res);
          wx.chooseLocation({
            success: function success(res) {
              that.Bmap(that, res.longitude + ',' + res.latitude);
            },
            fail: function fail(err) {
              console.log(err);
              that.setData({
                openType: 'openSetting'
              });
            }
          });
        } else {
          // 用户已授权
          wx.chooseLocation({
            success: function success(res) {
              that.Bmap(that, res.longitude + ',' + res.latitude);
              that.setData({
                openType: null,
                userAddress: res
              });
            }
          });
        }
      }
    });
  },

  // 获取设置
  opensetting: function opensetting(e) {
    if (!e.detail.authSetting['scope.userLocation']) {
      this.setData({
        openType: 'openSetting'
      });
    } else {
      this.setData({
        openType: null
      });
    }
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
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = res.tempFilePaths.entries()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _step8$value = _slicedToArray(_step8.value, 2),
                i = _step8$value[0],
                v = _step8$value[1];

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
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        that.setData({
          upImgArr: that.data.upImgArr
        });
        function noUse() {}
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data.upImgArr[index].Key
        //   })
        // }
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
  goRelease: function goRelease(e) {
    var that = this;
    if (!that.data.upImgArr6[0] || !that.data.upImgArr6[0].real) return app.setToast(that, { content: '请上传教室头像' });else if (!e.detail.value.name) return app.setToast(that, { content: '请填写教室名字' });else if (that.data.userAddress.address === '选择地址定位') return app.setToast(that, { content: '请选择教室所处地理位置' });
    var roomImages = [];
    var showImage = [];
    var roomTeacher = [];
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = that.data.upImgArr3[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var v = _step9.value;

        if (!v.real) return app.setToast(that, { content: '请等待图片上传完成' });
        roomImages.push(v.real);
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9.return) {
          _iterator9.return();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
        }
      }
    }

    if (roomImages.length < 1) return app.setToast(that, { content: '请至少上传一张教室宣传图片' });
    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = that.data.upImgArr5[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var _v = _step10.value;

        if (!_v.real) return app.setToast(that, { content: '请等待图片上传完成' });
        showImage.push(_v.real);
      }
    } catch (err) {
      _didIteratorError10 = true;
      _iteratorError10 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion10 && _iterator10.return) {
          _iterator10.return();
        }
      } finally {
        if (_didIteratorError10) {
          throw _iteratorError10;
        }
      }
    }

    if (showImage.length < 1) return app.setToast(that, { content: '请至少上传一张学员作品秀' });
    var _iteratorNormalCompletion11 = true;
    var _didIteratorError11 = false;
    var _iteratorError11 = undefined;

    try {
      for (var _iterator11 = that.data.upImgArr4[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
        var _v2 = _step11.value;

        if (!_v2.real) return app.setToast(that, { content: '请等待图片上传完成' });
        roomTeacher.push(_v2.real);
      }
    } catch (err) {
      _didIteratorError11 = true;
      _iteratorError11 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion11 && _iterator11.return) {
          _iterator11.return();
        }
      } finally {
        if (_didIteratorError11) {
          throw _iteratorError11;
        }
      }
    }

    app.wxrequest({
      url: app.getUrl().teacherDotSub,
      data: {
        id: that.data.id || '',
        openid: app.gs(),
        avatar: that.data.upImgArr6[0].real,
        user_id: app.gs('userInfoAll').id,
        room_name: e.detail.value.name,
        room_des: e.detail.value.desc || '',
        label_one: e.detail.value.label0 || '富力天域',
        label_two: e.detail.value.label1 || '十年纹绣',
        label_three: e.detail.value.label2 || 'ID品牌',
        room_images: roomImages.join(','),
        show_image: showImage.join(','),
        room_teacher: roomTeacher.join(','),
        code: that.data.addressInfo ? that.data.addressInfo.originalData.result.addressComponent.adcode : that.data.shopInfo.code,
        longitude: that.data.userAddress.longitude,
        latitude: that.data.userAddress.latitude,
        room_address: '' + that.data.userAddress.address + (e.detail.value.address || '')
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.id = res.data.data;
          app.su('roomInfo', res.data.data);
          wx.navigateTo({
            url: '../../coursePage/courseDetail/courseDetail?id=' + res.data.data + '&type=3'
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  getRoomInfo: function getRoomInfo() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().teacherDotDetail,
      data: {
        user_id: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (!res.data.data) return;
          that.data.upImgArr6.push({
            temp: res.data.data.avatar,
            real: res.data.data.avatar
          });
          that.data.labelArr[0] = res.data.data.label_one;
          that.data.labelArr[1] = res.data.data.label_two;
          that.data.labelArr[2] = res.data.data.label_three;
          var _iteratorNormalCompletion12 = true;
          var _didIteratorError12 = false;
          var _iteratorError12 = undefined;

          try {
            for (var _iterator12 = res.data.data.room_images.split(',')[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              var _v3 = _step12.value;

              that.data.upImgArr3.push({
                temp: _v3,
                real: _v3
              });
              that.data.upImgArrProgress3.push(100);
            }
          } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion12 && _iterator12.return) {
                _iterator12.return();
              }
            } finally {
              if (_didIteratorError12) {
                throw _iteratorError12;
              }
            }
          }

          var _iteratorNormalCompletion13 = true;
          var _didIteratorError13 = false;
          var _iteratorError13 = undefined;

          try {
            for (var _iterator13 = res.data.data.show_image.split(',')[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
              var _v4 = _step13.value;

              that.data.upImgArr5.push({
                temp: _v4,
                real: _v4
              });
              that.data.upImgArrProgress5.push(100);
            }
          } catch (err) {
            _didIteratorError13 = true;
            _iteratorError13 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion13 && _iterator13.return) {
                _iterator13.return();
              }
            } finally {
              if (_didIteratorError13) {
                throw _iteratorError13;
              }
            }
          }

          if (res.data.data.room_teacher) {
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
              for (var _iterator14 = res.data.data.room_teacher.split(',')[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                var v = _step14.value;

                that.data.upImgArr4.push({
                  temp: v,
                  real: v
                });
                that.data.upImgArrProgress4.push(100);
              }
            } catch (err) {
              _didIteratorError14 = true;
              _iteratorError14 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion14 && _iterator14.return) {
                  _iterator14.return();
                }
              } finally {
                if (_didIteratorError14) {
                  throw _iteratorError14;
                }
              }
            }
          }
          that.setData({
            shopInfo: res.data.data,
            id: res.data.data.id,
            upImgArrProgress4: that.data.upImgArrProgress4,
            upImgArrProgress3: that.data.upImgArrProgress3,
            upImgArrProgress5: that.data.upImgArrProgress5,
            labelArr: that.data.labelArr,
            upImgArr3: that.data.upImgArr3,
            upImgArr4: that.data.upImgArr4,
            upImgArr5: that.data.upImgArr5,
            upImgArr6: [{
              temp: res.data.data.avatar,
              real: res.data.data.avatar
            }],
            upImgArrProgress6: [100],
            userAddress: {
              address: res.data.data.room_address,
              latitude: res.data.data.latitude,
              longitude: res.data.data.longitude
            }
          });
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
    this.getRoomInfo();
    app.setBar(options.type || '学堂信息设置');
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