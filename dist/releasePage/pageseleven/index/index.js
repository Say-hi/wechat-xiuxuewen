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
    info: {
      freight: 0.00,
      is_up: -1,
      sku: [{
        value: '默认',
        price: 0.01,
        stock: 1,
        img: []
      }]
    },
    topIndex: 0,
    labelIndex: 0,
    sizeIndex: 0,
    addItemIndex: -3, // -1 增加规格子项，-2增加规格 -3隐藏 >=0 修改
    sizeArr: [{
      name: '颜色'
    }, {
      name: '产地'
    }, {
      name: '自定义'
    }],
    price: 1,
    stock: 1,
    sale: 1,
    upImgArr2: [],
    upImgArrProgress2: [],
    upImgArr3: [],
    upImgArrProgress3: []
  },
  addItemImg: function addItemImg(e) {
    new UpLoad({ count: 3, this: this, imgArr: e.currentTarget.dataset.index }).chooseImage();
  },

  // 修改规格图片
  changeItemImg: function changeItemImg(e) {
    new UpLoad({ count: 3, this: this, imgArr: e.currentTarget.dataset.oindex, index: e.currentTarget.dataset.index }).imgOp();
  },

  // 多图上传
  upImg2: function upImg2(index) {
    var imgArr = 'upImgArr2';
    var progressArr = 'upImgArrProgress2';
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
                upImgArrProgress2: that.data[progressArr]
              });
            }
          }, function (err, data) {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true;
              that.setData({
                upImgArr2: that.data[imgArr]
              });
            } else {
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

  // 图片操作
  imgOperation2: function imgOperation2(e) {
    if (!this.data.upImgArr2[e.currentTarget.dataset.index].real) return app.setToast(this, { content: '请稍后操作' });
    var that = this;
    var itemList = ['查看图片', '替换图片', '删除图片'];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.data.upImgArr2[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
          app.showImg(that.data.upImgArr2[e.currentTarget.dataset.index].temp, [that.data.upImgArr2[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
          that.data.upImgArr2.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upImgArr2: that.data.upImgArr2
          });
        } else if (res.tapIndex === 1) {
          that.upImg2(e.currentTarget.dataset.index);
        }
      }
    });
  },

  // 多图上传
  upImg3: function upImg3(index) {
    var imgArr = 'upImgArr3';
    var progressArr = 'upImgArrProgress3';
    var that = this;
    var length = that.data[imgArr].length || 0;
    var id = app.gs('userInfoAll').id || 10000;
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
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
  imgOperation3: function imgOperation3(e) {
    if (!this.data.upImgArr3[e.currentTarget.dataset.index].real) return app.setToast(this, { content: '请稍后操作' });
    var that = this;
    var itemList = ['查看图片', '替换图片', '删除图片'];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = this.data.upImgArr3[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
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
          app.showImg(that.data.upImgArr3[e.currentTarget.dataset.index].temp, [that.data.upImgArr3[e.currentTarget.dataset.index].temp]);
        } else if (res.tapIndex === 2) {
          that.data.upImgArr3.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upImgArr3: that.data.upImgArr3
          });
        } else if (res.tapIndex === 1) {
          that.upImg3(e.currentTarget.dataset.index);
        }
      }
    });
  },
  CTT: function CTT() {
    this.setData({
      cttIndex: !this.data.cttIndex
    });
  },
  chooseSale: function chooseSale() {
    this.setData(_defineProperty({}, 'info.is_up', this.data.info.is_up * 1 === 1 ? -1 : 1));
  },
  changeContent: function changeContent(e) {
    if (e.detail.target.dataset.type === 'cancel' && this.data.addItemIndex * 1 < 0) {
      return this.setData({
        addItemIndex: -3
      });
    }
    if (!e.detail.value.addItem.length) return app.setToast(this, { content: '请输入内容' });
    if (e.detail.target.dataset.type === 'cancel') {
      if (this.data.addItemIndex * 1 >= 0) {
        var _setData2;

        this.data.info.sku.splice(this.data.addItemIndex, 1);
        this.setData((_setData2 = {}, _defineProperty(_setData2, 'info.sku', this.data.info.sku.length <= 0 ? [{ value: '默认', price: 0.01, stock: 1 }] : this.data.info.sku), _defineProperty(_setData2, 'addItemIndex', -3), _setData2));
      } else {
        this.setData({
          addItemIndex: -3
        });
      }
    } else {
      if (this.data.addItemIndex * 1 === -1) {
        this.setData(_defineProperty({
          addItemIndex: -3
        }, 'info.sku[' + this.data.info.sku.length + ']', {
          value: e.detail.value.addItem,
          stock: 1,
          price: 0.01 }));
      } else if (this.data.addItemIndex * 1 === -2) {
        var _setData4;

        this.data.sizeArr.splice(this.data.sizeArr.length - 1, 0, { name: e.detail.value.addItem });
        this.setData((_setData4 = {
          sizeArr: this.data.sizeArr
        }, _defineProperty(_setData4, 'info.sku', []), _defineProperty(_setData4, 'addItemIndex', -3), _setData4));
      } else {
        var _setData5;

        this.setData((_setData5 = {}, _defineProperty(_setData5, 'info.sku[' + this.data.addItemIndex + '].value', e.detail.value.addItem), _defineProperty(_setData5, 'addItemIndex', -3), _setData5));
      }
    }
  },
  addItem: function addItem(e) {
    this.setData({
      addItemIndex: e.currentTarget.dataset.index
    });
  },
  sizeMore: function sizeMore() {
    this.setData({
      sizeMore: !this.data.sizeMore
    });
  },
  bindSizeChange: function bindSizeChange(e) {
    this.setData({
      sizeIndex: e.detail.value
    });
    if (e.detail.value >= this.data.sizeArr.length - 1) {
      this.setData({
        addItemIndex: -2
      });
    }
  },
  bindLabelChange: function bindLabelChange(e) {
    this.setData({
      labelIndex: e.detail.value
    });
  },
  tabChoose: function tabChoose(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    });
  },
  getCategory: function getCategory(options) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopCategoryList,
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            goodslabel: res.data.data
          }, function () {
            if (options.id) that.shopProduct(options.id);
          });
          app.su('shopLabel', res.data.data);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  shopProduct: function shopProduct(pid) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopProduct,
      data: {
        pid: pid
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          res.data.data.imgs = res.data.data.imgs ? res.data.data.imgs.split(',') : [];
          if (res.data.data.imgs.length > 0) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = res.data.data.imgs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var v = _step5.value;

                that.data.upImgArr2.push({
                  real: v,
                  temp: v,
                  key: v
                });
                that.data.upImgArrProgress2.push(100);
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
          // that.data.upImgArr2.unshift({
          //   real: res.data.data.img,
          //   temp: res.data.data.img,
          //   key: res.data.data.img
          // })
          that.data.upImgArrProgress2.unshift(100);
          res.data.data.detail = res.data.data.detail ? res.data.data.detail.split(',') : [];
          if (res.data.data.detail.length > 0) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = res.data.data.detail[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var _v = _step6.value;

                that.data.upImgArr3.push({
                  real: _v,
                  temp: _v,
                  key: _v
                });
                that.data.upImgArrProgress3.push(100);
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
          var sku = res.data.data.sku;
          sku.map(function (v, i) {
            if (!v.img) {
              sku[i].img = [];
            } else {
              var temp = v.img.split(',');
              var tempArr = [];
              temp.map(function (vv, ii) {
                tempArr.push({
                  temp: vv,
                  key: vv,
                  real: vv,
                  progress: 100
                });
              });
              sku[i].img = tempArr;
            }
          });
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = that.data.goodslabel.entries()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var _step7$value = _slicedToArray(_step7.value, 2),
                  i = _step7$value[0],
                  _v2 = _step7$value[1];

              if (_v2.id * 1 === res.data.data.cid * 1) {
                that.data.labelIndex = i;
                break;
              }
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

          var scount = 0;
          var _iteratorNormalCompletion8 = true;
          var _didIteratorError8 = false;
          var _iteratorError8 = undefined;

          try {
            for (var _iterator8 = that.data.sizeArr.entries()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
              var _step8$value = _slicedToArray(_step8.value, 2),
                  i = _step8$value[0],
                  _v3 = _step8$value[1];

              ++scount;
              if (_v3.name === res.data.data.label) {
                that.data.sizeIndex = i;
                break;
              }
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

          if (scount >= that.data.sizeArr.length) {
            that.data.sizeIndex = scount - 1;
            that.data.sizeArr.splice(scount - 1, 0, { name: res.data.data.label });
          }
          app.setBar(res.data.data.title);
          that.setData({
            info: res.data.data,
            upImgArr3: that.data.upImgArr3,
            upImgArrProgress3: that.data.upImgArrProgress3,
            upImgArr2: that.data.upImgArr2,
            upImgArrProgress2: that.data.upImgArrProgress2,
            labelIndex: that.data.labelIndex,
            sizeIndex: that.data.sizeIndex,
            sizeArr: that.data.sizeArr,
            sizeMore: res.data.data.label * 1 !== -1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  inputValue: function inputValue(e) {
    if (e.currentTarget.dataset.type === 'title') {
      this.setData(_defineProperty({}, 'info.title', e.detail.value));
    } else if (e.currentTarget.dataset.type === 'express') {
      this.setData(_defineProperty({}, 'info.freight', (e.detail.value * 1).toFixed(2)));
    } else {
      if (e.currentTarget.dataset.type === 'stock') {
        this.setData(_defineProperty({}, 'info.sku[' + e.currentTarget.dataset.index + '].stock', e.detail.value));
      } else {
        this.setData(_defineProperty({}, 'info.sku[' + e.currentTarget.dataset.index + '].price', (e.detail.value * 1).toFixed(2)));
      }
    }
  },
  upGoods: function upGoods() {
    var that = this;
    var imgs = [];
    var detail = [];
    var info = this.data.info;
    if (!info.title || info.title.length <= 0) return app.setToast(this, { content: '请输入产品标题' });
    if (this.data.upImgArr2.length <= 0) return app.setToast(this, { content: '最少上传一张商品图' });
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = this.data.upImgArr2[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var v = _step9.value;

        if (!v.real) return app.setToast(that, { content: '请等待所有图片上传完成' });
        imgs.push(v.real);
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

    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = this.data.upImgArr3[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var _v4 = _step10.value;

        if (!_v4.real) return app.setToast(that, { content: '请等待所有图片上传完成' });
        detail.push(_v4.real);
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

    var SKUS = info.sku;
    info.sku.map(function (v, index) {
      var temp = [];
      if (!v.img || !v.img.length) {
        temp.push(that.data.upImgArr2[0].real);
      } else {
        v.img.map(function (s, y) {
          if (s.progress < 98) return app.setToast(that, { content: '\u8BF7\u7B49\u5F85\u3010' + v.value + '\u3011\u5206\u7C7B\u7684\u56FE\u7247\u4E0A\u4F20\u5B8C\u6210' });
          temp.push(s.real);
        });
      }
      SKUS[index].img = temp.join(',');
    });
    app.wxrequest({
      url: app.getUrl()[that.data.info.id ? 'shopEdit' : 'shopRelease'],
      data: Object.assign({
        mid: app.gs('shopInfoAll').id,
        cid: that.data.goodslabel[that.data.labelIndex].id,
        parent_id: 0,
        title: info.title,
        img: that.data.upImgArr2[0].real,
        imgs: imgs.join(','),
        old_price: info.sku[0].price,
        freight: info.freight,
        is_up: info.is_up,
        label: that.data.sizeMore ? that.data.sizeArr[that.data.sizeIndex].name : -1,
        sku: JSON.stringify(SKUS),
        detail: detail.join(','),
        detail_text: info.detail_text || ''
      }, that.data.info.id ? { pid: that.data.info.id } : {}),
      success: function success(res2) {
        wx.hideLoading();
        if (res2.data.status === 200) {
          wx.showToast({
            title: '上传成功'
          });
          wx.navigateBack();
        } else {
          app.setToast(that, { content: res2.data.desc });
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
    this.getCategory(options);
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