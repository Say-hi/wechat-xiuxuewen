'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 获取全局应用程序实例对象
var app = getApp();
var timer = null;
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_info_img: app.gs('userInfoAll').avatar_url,
    user_zhipiao: false,
    discount_name: app.gs('shopInfoAll').rule.state_name || '无折扣',
    discount_value: app.gs('shopInfoAll').rule.discount || 1
  },
  // 秒杀逻辑
  setKill: function setKill() {
    // 拼团支付完成后倒计时
    var that = this;
    if (timer) clearInterval(timer);
    function kill() {
      var shutDown = 0;
      // console.log(that.data.killArr)
      if (!that.data.info) return;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = that.data.info.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 1),
              i = _step$value[0];

          // let nowData = new Date().getTime() // 毫秒数
          // console.log('startTime', new Date(that.data.killArr[i].startTime))
          // let startTime = that.data.list[i].start_time * 1000
          // let endTime = that.data.info[i].end_time * 1000 + base_time
          // console.log(nowData, startTime, endTime)
          that.data.info[i].effective_time = that.data.info[i].effective_time - 1;
          if (that.data.info[i].effective_time > 0) {
            // 进行中
            that.data.info[i].status = 1;
            that.data.info[i].h = Math.floor(that.data.info[i].effective_time * 1000 / 3600000);
            that.data.info[i].m = Math.floor(that.data.info[i].effective_time * 1000 % 3600000 / 60000);
            that.data.info[i].s = Math.floor(that.data.info[i].effective_time * 1000 % 60000 / 1000);
          } else {
            // 已结束
            if (that.data.info[i].status === 2) {
              ++shutDown;
              continue;
            }
            that.data.info[i].status = 2;
            that.data.info[i].h = '已';
            that.data.info[i].m = '结';
            that.data.info[i].s = '束';
          }
          that.setData({
            info: that.data.info
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

      if (shutDown === that.data.info.length) clearInterval(timer);
    }
    kill();
    timer = setInterval(function () {
      kill();
    }, 1000);
  },
  choosezhipiao: function choosezhipiao() {
    var that = this;
    this.setData({
      user_zhipiao: !this.data.user_zhipiao
    }, function () {
      if (that.data.user_zhipiao) {
        that.setData({
          finish_pay: that.data.finish_pay - that.data.recharge <= 0 ? '0.00' : (that.data.finish_pay - that.data.recharge).toFixed(2)
        });
      } else {
        that.setData({
          finish_pay: (that.data.AllPay * 1 + that.data.maxFreight * 1).toFixed(2)
        });
      }
    });
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
  getMyShareCode: function getMyShareCode() {
    wx.previewImage({
      urls: ['https://c.jiangwenqiang.com/api/logo.jpg']
    });
  },
  onShareAppMessage: function onShareAppMessage() {
    if (this.data.ping) {
      return {
        title: '快来和我一起参团享好物吧',
        path: '/shopListPage/shoplistpages/detail/detail?id=' + this.data.info[0].id + '&ping=ping&from=' + app.gs('userInfoAll').id,
        imageUrl: this.data.info[0].img
      };
    }
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
    // this.setData({
    //   need_pay: true
    // })
    // this.setKill()
    // return
    var that = this;
    var carts = [];
    if (this.data.type === 'car') {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.data.info[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var v = _step2.value;

          carts.push({
            pid: v.pid,
            count: v.count,
            value: v.value,
            sku_id: v.sku_id
          });
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
    }
    app.wxrequest({
      url: app.getUrl()[that.data.ping ? 'pingdirect' : that.data.payid ? 'shopPayAgain' : that.data.type === 'car' ? 'shoPayCart' : 'shoPayDirect'],
      data: that.data.ping ? {
        name: that.data.addressInfo.userName,
        phone: that.data.addressInfo.telNumber,
        address: '' + that.data.addressInfo.provinceName + that.data.addressInfo.cityName + that.data.addressInfo.countyName + that.data.addressInfo.detailInfo,
        mid: app.gs('shopInfoAll').id, // 需要修改
        pid: that.data.info[0].id,
        uid: app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid,
        sku_id: that.data.info[0].sku.id,
        count: that.data.info[0].count,
        value: that.data.info[0].sku.value,
        mode_id: that.data.modeId,
        group_id: that.data.modeId === 3 ? that.data.info[0].group[0].group_id : ''
      } : that.data.payid ? {
        oid: that.data.payid,
        mid: app.gs('shopInfoAll').id,
        uid: app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid
      } : Object.assign({
        name: that.data.addressInfo.userName,
        phone: that.data.addressInfo.telNumber,
        recharge: that.data.user_zhipiao ? that.data.recharge < that.data.AllPay * 1 + that.data.maxFreight * 1 ? that.data.recharge : (that.data.AllPay * 1 + that.data.maxFreight * 1).toFixed(2) : 0,
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
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = that.data.info[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _v = _step3.value;

                del.push({ id: _v.id });
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
          if (res.data.data.pay_way * 1 === 2) {
            that.setData({
              need_pay: true
            });
            // that.data.info[0].end_time = new Date().getTime() + 86400000
            if (that.data.ping && that.data.modeId !== 2 && that.data.info[0].people - that.data.info[0].group.length >= 1) that.setKill();
            // console.log(that.data.info[0])
            wx.removeStorageSync('buyInfo');
          } else {
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
          }
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
  shopInfo: function shopInfo() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var that = _this;
      app.wxrequest({
        url: app.getUrl().shopInfo,
        data: {
          mid: app.gs('shopInfo').mid || 10000
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            that.getUser();
            app.su('shopInfoAll', res.data.data);
            that.setData({
              discount_value: res.data.data.rule.discount || 1
            });
            resolve();
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      });
    });
  },
  getUser: function getUser() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        // uid: 10000
        uid: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.su('userInfoAll', res.data.data);
          that.setData({
            recharge: res.data.data.recharge || 0,
            agents: res.data.data.mall_is > 0
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
    var that = this;
    this.setData({
      ping: options.ping === 'ping',
      modeId: Math.floor(options.mode_id) || 0
    });
    this.shopInfo().then(function () {
      var allCount = 0;
      var Allmoney = 0;
      var maxFreight = 0;
      that.data.type = options.type;
      if (options.type === 'car') {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = app.gs('buyInfo')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var v = _step4.value;

            allCount += v.count * 1;
            Allmoney += v.count * v.price;
            maxFreight = maxFreight > v.freight ? maxFreight : v.freight;
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
      } else if (options.ping) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = app.gs('buyInfo')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _v2 = _step5.value;

            _v2.sku.price = _v2.sku.assemble_price;
            allCount += _v2.count;
            Allmoney += _v2.count * _v2.sku.price;
            maxFreight = maxFreight > _v2.freight ? maxFreight : _v2.freight;
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
      } else {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = app.gs('buyInfo')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _v3 = _step6.value;

            allCount += _v3.count;
            Allmoney += _v3.count * _v3.sku.price;
            maxFreight = maxFreight > _v3.freight ? maxFreight : _v3.freight;
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
      that.setData({
        info: app.gs('buyInfo'),
        allCount: allCount,
        // Allmoney: (Allmoney * (this.data.type === 'now' ? this.data.discount_value : 1)).toFixed(2),
        Allmoney: Allmoney.toFixed(2),
        AllPay: (Allmoney * that.data.discount_value).toFixed(2),
        maxFreight: maxFreight > 0 ? maxFreight : app.gs('shopInfoAll').rule.low_total_fee > Allmoney ? app.gs('shopInfoAll').rule.logistic_fee : maxFreight,
        addressInfo: app.gs('addressInfo') || null
      }, function () {
        that.setData({
          finish_pay: (that.data.AllPay * 1 + that.data.maxFreight * 1).toFixed(2)
        });
      });
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
    if (timer) clearInterval(timer);
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});