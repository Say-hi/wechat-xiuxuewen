'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 获取全局应用程序实例对象
var app = getApp();
console.log(app.data.all_Screen);
var startX = 0;
var timer = null;
// ping_status 0 未开始 1 进行中 -1结束
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mode_id: 1,
    in_area: true,
    buy_type: 'normal',
    ngshow: 1,
    list: [],
    group: [],
    enable_progress_gesture: true,
    systemVersion: app.data.systemVersion,
    num: 1,
    page: 0,
    labelIndex: 0,
    all_Screen: app.data.all_screen,
    discount_name: app.gs('shopInfoAll').discount_name,
    discount_value: app.gs('shopInfoAll').discount_value
  },
  // videotouchstart (e) {
  //   console.log(e)
  //   startX = e.changedTouches[0].clientX
  // },
  // videotouchend (e) {
  //   console.log(e)
  //   if (startX - e.changedTouches[0].clientX >= 30) {
  //     console.log(1)
  //     this.setData({
  //       current: 1
  //     })
  //   }
  // },
  showImg: function showImg(e) {
    wx.previewImage({
      urls: this.data.info.detail,
      current: this.data.info.detail[e.currentTarget.dataset.index]
    });
  },
  goSubmit: function goSubmit() {
    if (this.data.ping) {
      // 拼团检测
      if (this.data.info.ping_status === 0) return app.setToast(this, { content: '拼团活动还没有开始' });
      if (this.data.info.ping_status === -1) return app.setToast(this, { content: '拼团活动已结束' });
      if (this.data.buy_type === 'ping' && this.data.num > this.data.info.limited) return app.setToast(this, { content: '\u6BCF\u4EBA\u9650\u8D2D' + this.data.info.limited + '\u4EF6' });
    }
    if (this.data.num > this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, { content: '该产品已无库存' });
    if (this.data.addCar) {
      // 添加到购物车
      var that = this;
      return app.wxrequest({
        url: app.getUrl().shopCartAdd,
        data: Object.assign({
          uid: app.gs('userInfoAll').id,
          mid: that.data.info.mid,
          count: that.data.num,
          sku_id: that.data.info.sku[that.data.labelIndex].id,
          pid: that.data.info.id
        }),
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              num: 1,
              buyMask: that.data.info.label * 1 !== -1
            });
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      });
    }
    var _data$info = this.data.info,
        img = _data$info.img,
        title = _data$info.title,
        label = _data$info.label,
        sku = _data$info.sku,
        freight = _data$info.freight,
        id = _data$info.id,
        mid = _data$info.mid; // 直接购买

    app.su('buyInfo', [{ // 产品信息缓存
      id: id,
      img: img,
      title: title,
      label: label,
      freight: freight,
      people: this.data.info.group_num || 2,
      mid: mid,
      sku: sku[this.data.labelIndex],
      count: this.data.num,
      effective_time: this.data.info.effective_time,
      end_time: this.data.info.end_time,
      group: this.data.group.concat({
        img: app.gs('userInfoAll').avatar_url
      })
    }]);
    // if (this.data.ping && this.data.buy_type === 'ping') {
    if (this.data.ping) {
      if (this.data.options.user) {
        return wx.navigateTo({
          url: '../submit/submit?type=now&ping=ping&mode_id=' + (this.data.buy_type === 'ping' ? 1 : this.data.buy_type === 'join' ? 3 : 2)
        });
      }
      return wx.redirectTo({
        url: '../submit/submit?type=now&ping=ping&mode_id=' + (this.data.buy_type === 'ping' ? 1 : this.data.buy_type === 'join' ? 3 : 2)
      });
    }
    wx.redirectTo({
      url: '../submit/submit?type=now'
    });
  },
  sptChange: function sptChange(e) {
    this.setData({
      showPingIndex: e.currentTarget.dataset.index,
      showPingTeam: !this.data.showPingTeam
    });
  },
  buy: function buy(e) {
    if (this.data.ping) {
      // 拼团检查是否在区域内合法
      if (!this.data.in_area) {
        // 购买非法
        return this.setData({
          ngshow: ++this.data.ngshow
        });
      }
      if (e.currentTarget.dataset.type === 'ping') {
        // 发起拼团
        this.setData({
          buy_type: 'ping'
        });
      } else if (e.currentTarget.dataset.type === 'join') {
        this.setData({
          buy_type: 'join'
        });
      } else {
        // 拼团直接购买
        this.setData({
          buy_type: 'normal'
        });
      }
      this.setData({ // 规则选择
        buyMask: !this.data.buyMask
      });
      return;
    }
    this.data.addCar = e.currentTarget.dataset.type === 'car';
    this.setData({
      buyMask: !this.data.buyMask
    });
  },
  noUse: function noUse() {
    app.noUse();
  },
  numOperation: function numOperation(e) {
    var type = e.currentTarget.dataset.type;
    if (type === 'add') {
      if (this.data.ping) {
        if (this.data.info.ping_status === 0) return app.setToast(this, { content: '拼团活动还没有开始' });
        if (this.data.info.ping_status === -1) return app.setToast(this, { content: '拼团活动已结束' });
        if (this.data.buy_type === 'ping' && this.data.num >= this.data.info.limited) return app.setToast(this, { content: '\u6BCF\u4EBA\u9650\u8D2D' + this.data.info.limited + '\u4EF6' });
      }
      if (this.data.num >= this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, { content: '已达库存上限' });
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
    this.setData({
      labelIndex: e.currentTarget.dataset.index,
      current: 0
    });
  },
  shopProduct: function shopProduct(pid) {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[that.data.ping ? 'pindetail' : 'shopProduct'],
      // url: app.getUrl()[that.data.ping ? 'shopProduct' : 'shopProduct'],
      data: {
        pid: pid
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (that.data.ping) {
            res.data.data.ping_status = new Date().getTime() < res.data.data.start_time * 1000 ? 0 : new Date().getTime() < res.data.data.end_time * 1000 ? 1 : -1;
          }
          res.data.data.imgs = res.data.data.imgs ? res.data.data.imgs.split(',') : [];
          res.data.data.detail = res.data.data.detail ? res.data.data.detail.split(',') : [];
          app.setBar(res.data.data.title);
          res.data.data['stock'] = 0;
          if (!that.data.ping) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = res.data.data.sku[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var v = _step.value;

                v['discount'] = (v.price * that.data.discount_value).toFixed(2);
                res.data.data['stock'] += v.stock * 1;
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
          } else {
            res.data.data.pin_show_price = res.data.data.sku[0].assemble_price.split('.');
            res.data.data.count_sale = res.data.data.count_sale >= 10000 ? Math.floor(res.data.data.count_sale / 1000).toFixed(2) + '万' : res.data.data.count_sale;
          }
          var sku = res.data.data.sku;
          sku.map(function (v, i) {
            if (!v.img) {
              sku[i].img = [];
            } else {
              var temp = v.img.split(',');
              var tempArr = [];
              temp.map(function (vv, ii) {
                tempArr.push(vv);
              });
              sku[i].img = tempArr;
            }
          });
          that.setData({
            info: res.data.data
          });
          if (that.data.ping) {
            that.getPingTeam();
          }
        } else {
          app.setToast(that, { content: res.data.desc });
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

  // 秒杀逻辑
  setKill: function setKill() {
    var that = this;
    if (timer) clearInterval(timer);
    function kill() {
      var shutDown = 0;
      // console.log(that.data.killArr)
      if (!that.data.list) return;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = that.data.list.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              i = _step2$value[0],
              v = _step2$value[1];

          var nowData = new Date().getTime(); // 毫秒数
          // console.log('startTime', new Date(that.data.killArr[i].startTime))
          // let startTime = that.data.list[i].start_time * 1000
          var endTime = that.data.list[i].end_time;
          // console.log(nowData, startTime, endTime)
          if (nowData < endTime) {
            // 进行中
            that.data.list[i].status = 1;
            that.data.list[i].h = Math.floor((endTime - nowData) / 3600000);
            that.data.list[i].m = Math.floor((endTime - nowData) % 3600000 / 60000);
            that.data.list[i].s = Math.floor((endTime - nowData) % 60000 / 1000);
          } else {
            // 已结束
            if (that.data.list[i].status === 2) {
              ++shutDown;
              continue;
            }
            that.data.list[i].status = 2;
            that.data.list[i].h = '已';
            that.data.list[i].m = '结';
            that.data.list[i].s = '束';
          }
          that.setData({
            list: that.data.list
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

      if (shutDown === that.data.info.length) clearInterval(timer);
    }
    kill();
    timer = setInterval(function () {
      kill();
    }, 1000);
  },
  getPingTeam: function getPingTeam() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().pinteam,
      data: {
        pid: that.data.info.id,
        page: ++that.data.page
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var tempList = [];
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = res.data.data.lists[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var v = _step3.value;

              var teamTemp = {
                user: []
              };
              var groupL = {};
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = v[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var s = _step4.value;

                  if (s.mode_id <= 1) {
                    // 团长
                    teamTemp['group_id'] = s.group_id;
                    teamTemp['end_time'] = (s.create_time + that.data.info.effective_time) * 1000;
                    groupL = s;
                  } else {
                    teamTemp.user.push(s);
                  }
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

              teamTemp.user.unshift(groupL);
              tempList.push(teamTemp);
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
            list: that.data.list.concat(tempList),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          }, that.setKill());
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 获取拼团信息
  getpinglaunch: function getpinglaunch(oid, mid) {
    return this.shopProduct(5);
    // let that = this
    // app.wxrequest({
    //   url: app.getUrl().pinglaunch,
    //   data: {
    //     oid,
    //     uid: app.gs('userInfoAll').id,
    //     mid
    //   },
    //   success (res) {
    //     wx.hideLoading()
    //     if (res.data.status === 200) {
    //       if (!that.data.info.id) {
    //         that.shopProduct(res.data.data.id)
    //         that.setData({
    //           group: res.data.data.group
    //         })
    //       }
    //     } else {
    //       app.setToast(that, {content: res.data.desc})
    //     }
    //   }
    // })
  },


  // 授权相关
  getUser: function getUser(out) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
        // uid: 10000
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          // if (res.data.data.mall_id <= 10000 && app.gs('shopInfo').mid > 10000 && app.gs('shopInfo').user) that.shopBinding()
          that.shopBinding(out);
          // if (!that.data.userInfo || that.data.userInfo.nickname !== '未登录用户请在【用户中心】进行登录') {
          //   // that.setData({
          //   //   userInfo: res.data.data
          //   // })
          //   if (res.data.data.nickname === '游客' || !res.data.data.phone || res.data.data.phone.length < 6) return
          // }
          // if (res.data.data.mall_is * 1 === 1) {
          //   app.su('shopInfo', {mid: res.data.data.id})
          //   // that.setData({
          //   //   noshop: false
          //   // }, that.getVideo)
          // } else if (res.data.data.mall_id) {
          //   app.su('shopInfo', {mid: res.data.data.mall_id})
          //   // that.setData({
          //   //   noshop: false
          //   // }, that.getVideo)
          // } else {
          //   // that.setData({
          //   //   noshop: !app.gs('shopInfo').mid
          //   // }, that.getVideo)
          // }
        } else {
          if (res.data.desc === '发生错误,联系管理员') {
            wx.removeStorageSync('userInfoAll');
            app.wxlogin();
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      }
    });
  },

  // 店铺绑定
  shopBinding: function shopBinding(out) {
    if (out) return;
    var that = this;
    if (!app.gs('shopInfo').mid) return;
    app.wxrequest({
      url: app.getUrl().shopBinding,
      data: {
        mid: app.gs('shopInfo').mid,
        sid: app.gs('shopInfo').user,
        uid: app.gs('userInfoAll').id
      },
      complete: function complete() {
        that.getUser(1);
        wx.hideLoading();
      }
    });
  },

  // 获取店铺信息
  shopInfo: function shopInfo() {
    var that = this;
    if (this.data.noshop) return;
    app.wxrequest({
      url: app.getUrl().shopInfo,
      data: {
        mid: app.gs('shopInfo').mid || 10000
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (res.data.data.status < 0) {
            app.setToast(that, { content: '该店因违规被封闭，即将跳转回官方店铺' });
            setTimeout(function () {
              return wx.reLaunch({
                url: '/shopPage/shoppages/index/index'
              });
            }, 1500);
          }
          app.su('shopInfoAll', res.data.data);
          that.getpinglaunch(that.data.options.oid, that.data.options.mid);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  login: function login() {
    app.wxlogin();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    console.log('options', options);
    // 通过分享进入拼团
    if (options.scene || options.share) {
      var that = this;
      if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin(); // 处理第一次进入的情况
      var scene = decodeURIComponent(options.scene).split(',');
      if (options.share) scene = options.share;
      options.oid = scene[0]; // 拼团订单id
      options.mid = scene[1]; // 商家id
      options.user = scene[2]; // 分享者id
      options.ping = 'ping'; // 拼团标识
      app.su('shopInfo', { mid: options.mid, user: options.user });
      this.setData({
        options: options,
        ping: options.ping === 'ping'
      }, function () {
        // 分享过来的团先查询后插入拼团列表第一位
        if (!app.gs('shopInfoAll')) {
          that.shopInfo();
        } else {
          that.getpinglaunch(that.data.options.oid, that.data.options.mid);
        }
      });
    } else {
      this.setData({
        options: options,
        ping: options.ping === 'ping'
      });
      this.shopProduct(options.id);
    }
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