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
    courseArr: ['视频课程', '手把手线下课程', '跟师学驻店课程'],
    labelArr: app.data.label,
    courseIndex: 0,
    labelIndex: 0,
    videoUrl: null,
    upImgArr: [],
    upImgArrProgress: [],
    upImgArr2: [],
    upImgArrProgress2: [],
    upImgArr3: [],
    upImgArrProgress3: [],
    upImgArr4: [],
    upImgArrProgress4: [],
    startDay: app.momentFormat(new Date(), 'YYYY/MM/DD'),
    startDay2: app.momentFormat(app.momentAdd(1, 'd'), 'YYYY/MM/DD'),
    endDay: app.momentFormat(app.momentAdd(3, 'M'), 'YYYY/MM/DD'),
    endDayShould: ''
  },
  inputValue: function inputValue(e) {
    app.inputValue(e, this);
  },
  chooseF: function chooseF(e) {
    if (e.currentTarget.dataset.type === 'course') {
      if (this.data.id) return app.setToast(this, { content: '不可修改课程类型' });
      if (e.currentTarget.dataset.index > app.gs('userInfoAll').is_teach) return app.setToast(this, { content: '您还没有权限发布此类型的课程，请联系客服' });
      this.setData({
        courseIndex: e.currentTarget.dataset.index
      });
    } else {
      this.setData({
        labelIndex: e.currentTarget.dataset.index
      });
    }
  },
  upVideo: function upVideo() {
    if (this.data.upText === '上传中' || this.data.upText === '等待上传') return;
    var that = this;
    this.setData({
      speed: '0KB/s',
      upText: '等待上传'
    });
    var start = new Date().getTime();
    wx.chooseVideo({
      compressed: that.data.compressd,
      success: function success(res) {
        that.setData({
          duration: res.duration,
          videoUrl: res.tempFilePath,
          size: res.size / 1024 > 1024 ? res.size / 1024 / 1024 + 'M' : res.size / 1024 + 'KB'
        });
        var v = res.tempFilePath;
        var Key = 'video/' + (app.gs('userInfoAll').id || 10000) + '/' + v.substr(v.lastIndexOf('/') + 1);
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: Key,
          FilePath: v,
          onProgress: function onProgress(info) {
            that.setData({
              percent: info.percent * 100,
              upText: '上传中',
              speed: info.speed / 1024 > 1024 ? (info.speed / 1024 / 1024).toFixed(2) + 'M/s' : (info.speed / 1024).toFixed(2) + 'KB/s'
            });
          }
        }, function (err, data) {
          that.data.time = (new Date().getTime() - start) / 1000;
          if (err) {
            console.error('upLoadErr', err);
            that.setData({
              upText: '失败,请上传不超过100M大小的MP4格式视频'
            });
          } else {
            console.log('data', data);
            that.setData({
              upText: '成功',
              videoUlrR: 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key
            });
          }
        });
      },
      fail: function fail() {
        that.setData({
          upText: '',
          speed: '替换视频'
        });
      }
    });
  },
  upImg: function upImg(e, index) {
    var imgArr = void 0,
        progressArr = void 0;
    if (e.currentTarget.dataset.type === 'detail') {
      imgArr = 'upImgArr2';
      progressArr = 'upImgArrProgress2';
    } else {
      imgArr = 'upImgArr';
      progressArr = 'upImgArrProgress';
    }
    if (this.data[imgArr].length > 0) {
      if (this.data[imgArr][0].real) {
        index = 0;
      } else {
        return;
      }
    }
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

        if (e.currentTarget.dataset.type === 'detail') {
          that.setData({
            upImgArr2: that.data[imgArr]
          });
        } else {
          that.setData({
            upImgArr: that.data[imgArr]
          });
        }
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
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArrProgress2: that.data[progressArr]
                });
              } else {
                that.setData({
                  upImgArrProgress: that.data[progressArr]
                });
              }
            }
          }, function (err, data) {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true;
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArr2: that.data[imgArr]
                });
              } else {
                that.setData({
                  upImgArr: that.data[imgArr]
                });
              }
            } else {
              console.log(data);
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key;
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key;
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArr2: that.data[imgArr]
                });
              } else {
                that.setData({
                  upImgArr: that.data[imgArr]
                });
              }
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1);
          });
        })(0);
      }
    });
  },
  bindDateChange: function bindDateChange(e) {
    if (e.currentTarget.dataset.type === 'start') {
      this.setData({
        userChooseStart: app.momentFormat(e.detail.value, 'YYYY/MM/DD'),
        startDay2: app.momentFormat(app.momentAdd(1, 'd', e.detail.value), 'YYYY/MM/DD'),
        userChooseEnd: app.momentFormat(app.momentAdd(1, 'd', e.detail.value), 'YYYY/MM/DD'),
        endDay: app.momentFormat(app.momentAdd(3, 'M', e.detail.value), 'YYYY/MM/DD')
      });
      app.setToast(this, { content: '请选择结束日期', image: null });
    } else {
      this.setData({
        userChooseEnd: app.momentFormat(e.detail.value, 'YYYY/MM/DD')
      });
    }
  },

  // 课程详情上传
  upImgDetail: function upImgDetail(index) {
    var imgArr = 'upImgArr2';
    var progressArr = 'upImgArrProgress2';
    var that = this;
    var length = that.data[imgArr].length || 0;
    var id = app.gs('userInfoAll').id || 10000;
    wx.chooseImage({
      count: 1,
      success: function success(res) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = res.tempFilePaths.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                i = _step2$value[0],
                v = _step2$value[1];

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
          upImgArr2: that.data[imgArr]
        });
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
                upImgArrProgress2: that.data[progressArr],
                courseDetailUp: info.percent * 100 >= 99 ? 0 : 1
              });
            }
          }, function (err, data) {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true;
              that.setData({
                upImgArr2: that.data[imgArr]
              });
            } else {
              console.log(data);
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + Key;
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key;
              that.setData({
                upImgArr2: that.data[imgArr]
              });
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1);
          });
        })(0);
      }
    });
  },

  // 课程详情上传图片操作
  courseDetailUpImgOperation: function courseDetailUpImgOperation(e) {
    if (this.data.courseDetailUp) return app.setToast(this, { content: '图片上传中,请稍后操作' });
    var that = this;
    var itemList = ['查看图片', '替换图片', '删除图片'];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this.data.upImgArr2[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
          app.showImg(that.data.upImgArr2[e.currentTarget.dataset.index].temp, [that.data.upImgArr2[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
          that.data.upImgArr2.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upImgArr2: that.data.upImgArr2
          });
        } else if (res.tapIndex === 1) {
          that.upImgDetail(e.currentTarget.dataset.index);
        }
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
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = res.tempFilePaths.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _step4$value = _slicedToArray(_step4.value, 2),
                i = _step4$value[0],
                v = _step4$value[1];

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

        that.setData({
          upImgArr3: that.data[imgArr]
        });
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
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = this.data.upImgArr3[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var v = _step5.value;

        if (!v.real) itemList = ['查看图片', '替换图片'];
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

    wx.showActionSheet({
      itemList: itemList,
      success: function success(res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr3[e.currentTarget.dataset.index].temp, [that.data.upImgArr3[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
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
      count: index >= 0 ? 1 : 9 - length,
      success: function success(res) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = res.tempFilePaths.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _step6$value = _slicedToArray(_step6.value, 2),
                i = _step6$value[0],
                v = _step6$value[1];

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

        that.setData({
          upImgArr4: that.data[imgArr]
        });
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
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = this.data.upImgArr4[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var v = _step7.value;

        if (!v.real) itemList = ['查看图片', '替换图片'];
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

    wx.showActionSheet({
      itemList: itemList,
      success: function success(res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr4[e.currentTarget.dataset.index].temp, [that.data.upImgArr4[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
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
  upno: function upno() {
    app.setToast(this, { content: '图片上传中，请稍后操作' });
  },
  goRelease: function goRelease() {
    if (this.data.courseIndex * 1 === 0) {
      this.subOnline();
    } else {
      this.subOffline();
    }
  },

  // 发布线下课程
  subOffline: function subOffline() {
    var that = this;
    if (!that.data.nameText) return app.setToast(this, { content: '请填写课程标题' });
    if (!that.data.upImgArr.length) return app.setToast(this, { content: '请上传课程封面' });
    var showImage = [];
    var classImage = [];
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = this.data.upImgArr4[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var v = _step8.value;

        classImage.push(v.real);
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

    if (!classImage.length && that.data.courseIndex * 1 === 2) return app.setToast(this, { content: '请上传至少一张教室环境图片' });
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = this.data.upImgArr3[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var _v = _step9.value;

        showImage.push(_v.real);
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

    if (!showImage.length) return app.setToast(this, { content: '请上传至少一张作品秀图片' });
    app.wxrequest({
      url: app.getUrl().teacherActiveSub,
      data: that.data.courseIndex * 1 === 1 ? {
        id: that.data.id || '',
        user_id: app.gs('userInfoAll').id,
        style: that.data.courseIndex * 2,
        label: that.data.labelArr[that.data.labelIndex].label,
        title: that.data.nameText,
        image: that.data.upImgArr[0].real,
        class_time: '随到随学',
        start_time: that.data.userChooseStart ? new Date(that.data.userChooseStart).getTime().toString().slice(0, 10) : new Date(that.data.startDay).getTime().toString().slice(0, 10),
        end_time: that.data.userChooseEnd ? new Date(that.data.userChooseEnd).getTime().toString().slice(0, 10) : new Date(that.data.startDay2).getTime().toString().slice(0, 10),
        show_image: showImage.join(','),
        class_image: ''
      } : {
        id: that.data.id || '',
        user_id: app.gs('userInfoAll').id,
        style: that.data.courseIndex * 2,
        label: that.data.labelArr[that.data.labelIndex].label,
        title: that.data.nameText,
        image: that.data.upImgArr[0].real,
        class_time: '随到随学',
        start_time: that.data.userChooseStart ? new Date(that.data.userChooseStart).getTime().toString().slice(0, 10) : new Date(that.data.startDay).getTime().toString().slice(0, 10),
        end_time: that.data.userChooseEnd ? new Date(that.data.userChooseEnd).getTime().toString().slice(0, 10) : new Date(that.data.startDay2).getTime().toString().slice(0, 10),
        show_image: showImage.join(','),
        class_image: classImage.join(',')
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.id = res.data.data;
          wx.navigateTo({
            url: '../../coursePage/courseDetail2/courseDetail?id=' + res.data.data + '&type=' + that.data.courseIndex * 2
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 发布线上课程
  subOnline: function subOnline() {
    var that = this;
    if (!that.data.videoUlrR) return app.setToast(this, { content: '请上传课程视频或等待课程上传完毕' });else if (!that.data.upImgArr.length || !that.data.upImgArr[0].real) return app.setToast(this, { content: '请上传视频封面图' });else if (!that.data.nameText) return app.setToast(this, { content: '请填写视频标题' });
    var detail = [];
    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = this.data.upImgArr2[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var v = _step10.value;

        detail.push(v.real);
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

    app.wxrequest({
      url: app.getUrl().teacherCourseSub,
      data: Object.assign({
        user_id: app.gs('userInfoAll').id,
        title: that.data.nameText,
        label: that.data.labelArr[that.data.labelIndex].label,
        video_url: that.data.videoUlrR,
        image: that.data.upImgArr[0].real,
        detail: detail.join(','),
        is_free: 0,
        video_time: Math.floor(that.data.duration) || 0
      }, that.data.id ? { id: that.data.id } : {}),
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.id = res.data.data;
          wx.navigateTo({
            url: '../../coursePage/courseDetail2/courseDetail?id=' + res.data.data + '&type=1'
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 线上课程详情
  getDetail: function getDetail() {
    var that = this;
    app.wxrequest({
      url: that.data.courseIndex * 1 === 0 ? app.getUrl().courseDetail : app.getUrl().activeDetail,
      data: that.data.courseIndex * 1 === 0 ? {
        course_id: that.data.id,
        user_id: app.gs('userInfoAll').id
      } : {
        active_id: that.data.id,
        user_id: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        var s = res.data.data;
        // 封面
        if (s.image) {
          that.data.upImgArr.push({
            temp: s.image,
            real: s.image
          });
        }
        // 详情
        if (s.detail) {
          var _iteratorNormalCompletion11 = true;
          var _didIteratorError11 = false;
          var _iteratorError11 = undefined;

          try {
            for (var _iterator11 = s.detail.split(',')[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
              var v = _step11.value;

              that.data.upImgArr2.push({
                temp: v,
                real: v
              });
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
        }
        if (s.show_image) {
          var _iteratorNormalCompletion12 = true;
          var _didIteratorError12 = false;
          var _iteratorError12 = undefined;

          try {
            for (var _iterator12 = s.show_image.split(',')[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              var _v2 = _step12.value;

              that.data.upImgArr3.push({
                temp: _v2,
                real: _v2
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
        }
        if (s.class_image) {
          var _iteratorNormalCompletion13 = true;
          var _didIteratorError13 = false;
          var _iteratorError13 = undefined;

          try {
            for (var _iterator13 = s.class_image.split(',')[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
              var _v3 = _step13.value;

              that.data.upImgArr4.push({
                temp: _v3,
                real: _v3
              });
              that.data.upImgArrProgress4.push(100);
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
        }
        that.setData({
          userChooseStart: app.momentFormat(s.start_time * 1000, 'YYYY/MM/DD'),
          userChooseEnd: app.momentFormat(s.end_time * 1000, 'YYYY/MM/DD'),
          endDay: app.momentFormat(app.momentAdd(3, 'M', s.start_time * 1000), 'YYYY/MM/DD'),
          labelIndex: s.label - 1,
          videoUrl: s.video_url,
          upText: '成功',
          videoUlrR: s.video_url,
          nameText: s.title,
          upImgArr: that.data.upImgArr,
          upImgArr2: that.data.upImgArr2,
          upImgArr3: that.data.upImgArr3,
          upImgArrProgress3: that.data.upImgArrProgress3,
          upImgArr4: that.data.upImgArr4,
          upImgArrProgress4: that.data.upImgArrProgress4
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    if (options.id) {
      this.data.id = options.id;
      this.setData({
        courseIndex: options.courseIndex
      }, this.getDetail);
    }
    app.setBar('发布课程');
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
//# sourceMappingURL=releaseCourse.js.map
