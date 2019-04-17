'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    discount_name: app.gs('shopInfoAll').rule.state_name,
    discount_value: app.gs('shopInfoAll').rule.discount
  },
  // 选择地址
  chooseAddress: function chooseAddress() {
    if (this.data.lostTime) return;
    var that = this;
    wx.chooseAddress({
      success: function success(res) {
        if (res.telNumber) {
          // 获取信息成功
          wx.setStorageSync('addressInfo', res);
          that.setData({
            needSetting: false,
            addressInfo: res
          });
        }
      },
      fail: function fail() {
        wx.getSetting({
          success: function success(res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              });
              app.setToast(that, { content: '需授权获取地址信息' });
            }
          }
        });
      }
    });
  },

  // 获取设置
  openSetting: function openSetting() {
    var that = this;
    wx.openSetting({
      success: function success(res) {
        // console.log(res)
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          });
          that.chooseAddress();
        }
      }
    });
  },
  gohome: function gohome() {
    wx.reLaunch({
      url: '/shopPage/shoppages/index/index'
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

  // 立即付款
  shoPayDirect: function shoPayDirect() {
    var that = this;
    var carts = [];
    if (this.data.type === 'car') {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.data.info[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          carts.push({
            pid: v.pid,
            count: v.count,
            value: v.value,
            sku_id: v.sku_id
          });
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
      url: app.getUrl()[that.data.payid ? 'shopPayAgain' : that.data.type === 'car' ? 'shoPayCart' : 'shoPayDirect'],
      data: that.data.payid ? {
        oid: that.data.payid,
        mid: app.gs('shopInfoAll').id,
        uid: app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid
      } : Object.assign({
        name: that.data.addressInfo.userName,
        phone: that.data.addressInfo.telNumber,
        recharge: that.data.recharge || 0,
        address: '' + that.data.addressInfo.provinceName + that.data.addressInfo.cityName + that.data.addressInfo.countyName + that.data.addressInfo.detailInfo,
        mid: app.gs('shopInfoAll').id,
        uid: app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid
      }, that.data.type === 'car' ? {
        carts: JSON.stringify(carts)
      } : {
        pid: that.data.info[0].id,
        value: that.data.info[0].sku.value,
        sku_id: that.data.info[0].sku.id,
        count: that.data.info[0].count
      }),
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.payid = res.data.data.oid;
          if (that.data.type === 'car') {
            var del = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = that.data.info[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _v = _step2.value;

                del.push({ id: _v.id });
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

            app.wxrequest({
              url: app.getUrl().shopCartDelete,
              data: {
                uid: app.gs('userInfoAll').id,
                cart_id: JSON.stringify(del)
              },
              complete: function complete() {
                wx.hideLoading();
              }
            });
          }
          app.wxpay2(res.data.data.msg).then(function () {
            that.setData({
              need_pay: true
            });
            wx.removeStorageSync('buyInfo');
          }).catch(function () {
            wx.showToast({
              title: '支付失败'
            });
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  submit: function submit() {
    if (!this.data.addressInfo) return app.setToast(this, { content: '请选择您的收货地址' });
    this.shoPayDirect();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    var allCount = 0;
    var Allmoney = 0;
    var maxFreight = 0;
    this.data.type = options.type;
    if (options.type === 'car') {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = app.gs('buyInfo')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var v = _step3.value;

          allCount += v.count * 1;
          Allmoney += v.count * v.price;
          maxFreight = maxFreight > v.freight ? maxFreight : v.freight;
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
    } else {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = app.gs('buyInfo')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _v2 = _step4.value;

          allCount += _v2.count;
          Allmoney += _v2.count * _v2.sku.price;
          maxFreight = maxFreight > _v2.freight ? maxFreight : _v2.freight;
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
      info: app.gs('buyInfo'),
      allCount: allCount,
      // Allmoney: (Allmoney * (this.data.type === 'now' ? this.data.discount_value : 1)).toFixed(2),
      Allmoney: Allmoney.toFixed(2),
      AllPay: (Allmoney * this.data.discount_value).toFixed(2),
      maxFreight: maxFreight > 0 ? maxFreight : app.gs('shopInfoAll').rule.low_total_fee > Allmoney ? app.gs('shopInfoAll').rule.logistic_fee : maxFreight,
      addressInfo: app.gs('addressInfo') || null
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
    wx.removeStorageSync('buyInfo');
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});