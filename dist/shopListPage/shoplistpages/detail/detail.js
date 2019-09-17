'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 获取全局应用程序实例对象
var app = getApp();
console.log(app.data.all_Screen);
var startX = 0;
var timer = null;
var timer2 = null;
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
      if (this.data.mode_id * 1 === 1) {
        if (this.data.info.ping_status === 0) return app.setToast(this, { content: '拼团活动还没有开始' });
        if (this.data.info.ping_status === -1) return app.setToast(this, { content: '拼团活动已结束' });
      } else {
        if (this.data.group[this.data.showPingIndex].status > 1 || this.data.group[this.data.showPingIndex].user.length >= this.data.info.group_num) return app.setToast(this, { content: '此拼团已结束，请选择其他拼团' });
      }
      if ((this.data.buy_type === 'ping' || this.data.buy_type === 'join') && this.data.num > this.data.info.limited) return app.setToast(this, { content: '\u6BCF\u4EBA\u9650\u8D2D' + this.data.info.limited + '\u4EF6' });
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
      groupInfo: this.data.showPingIndex >= 0 ? {
        p: this.data.group[this.data.showPingIndex].user.concat({
          avatar_url: app.gs('userInfoAll').avatar_url
        }),
        id: this.data.group[this.data.showPingIndex].group_id,
        end_time: this.data.group[this.data.showPingIndex].end_time
      } : {
        p: [{
          avatar_url: app.gs('userInfoAll').avatar_url
        }],
        id: null,
        end_time: this.data.info.end_time
      }
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
    if (e.currentTarget.dataset.type === 'close') {
      this.setData({
        showPingTeam: !this.data.showPingTeam
      });
    } else {
      if (this.data.group[e.currentTarget.dataset.index].status > 1 || this.data.group[e.currentTarget.dataset.index].user.length >= this.data.info.group_num) return app.setToast(this, { content: '此拼团已结束，请选择其他拼团' });
      this.setData({
        showPingIndex: e.currentTarget.dataset.index,
        showPingTeam: !this.data.showPingTeam
      });
    }
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
        if (this.data.group[this.data.showPingIndex].status > 1 || this.data.group[this.data.showPingIndex].user.length >= this.data.info.group_num) return app.setToast(this, { content: '此拼团已结束，请选择其他拼团' });
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
        if (this.data.mode_id * 1 === 1) {
          if (this.data.info.ping_status === 0) return app.setToast(this, { content: '拼团活动还没有开始' });
          if (this.data.info.ping_status === -1) return app.setToast(this, { content: '拼团活动已结束' });
        } else {
          if (this.data.group[this.data.showPingIndex].status > 1) return app.setToast(this, { content: '此拼团已结束，请选择其他拼团' });
        }
        // if (this.data.info.ping_status === 0) return app.setToast(this, {content: '拼团活动还没有开始'})
        // if (this.data.info.ping_status === -1) return app.setToast(this, {content: '拼团活动已结束'})
        if ((this.data.buy_type === 'ping' || this.data.buy_type === 'join') && this.data.num >= this.data.info.limited) return app.setToast(this, { content: '\u6BCF\u4EBA\u9650\u8D2D' + this.data.info.limited + '\u4EF6' });
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
      data: Object.assign({ pid: pid }, that.data.ping ? {} : {
        uid: app.gs('userInfoAll').id,
        mid: app.gs('shopInfoAll').id
      }),
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
            info: res.data.data,
            sharePic: res.data.data.cid * 1 === 9
          });
          if (that.data.ping) {
            that.getPingTeam();
            that.setInfoKill();
          }
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  copyText: function copyText() {
    wx.setClipboardData({
      data: this.data.info.detail_text,
      success: function success() {
        wx.showToast({
          title: '文字已复制'
        });
      }
    });
  },
  sbshare: function sbshare() {
    this.setData({
      sbShare: !this.data.sbShare
    });
  },
  gopicshare: function gopicshare() {
    this.sbshare();
    app.data.shareimgurl = this.data.info.img;
    app.data.sharemoney = this.data.info.old_price;
    app.data.sharename = this.data.info.title;
    wx.navigateTo({
      url: '/sharePicturePage/shoppages/index/carShare?id=' + this.data.info.id
    });
  },
  getQrcode: function getQrcode(e) {
    if (e.currentTarget.dataset.index < 0) {
      this.setData({
        qrimg: null
      });
      return;
    }
    var that = this;
    app.wxrequest({
      url: app.getUrl().qrcode,
      data: {
        pid: that.data.info.id,
        uid: app.gs('userInfoAll').id,
        mid: app.gs('shopInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            qrimg: res.data.data
          });
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
        title: '\u3010\u597D\u7269\u63A8\u8350\u3011' + this.data.info.title,
        imageUrl: '' + this.data.info.img,
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id + '&user=' + app.gs('userInfoAll').id + '&pid=' + this.data.info.id
      };
    }
  },
  setInfoKill: function setInfoKill() {
    var that = this;
    if (timer2) clearInterval(timer2);
    timer2 = setInterval(function () {
      that.data.info.ping_status = new Date().getTime() < that.data.info.start_time * 1000 ? 0 : new Date().getTime() < that.data.info.end_time * 1000 ? 1 : -1;
    }, 1000);
  },

  // 秒杀逻辑
  setKill: function setKill() {
    var that = this;
    if (timer) clearInterval(timer);
    function kill() {
      var shutDown = 0;
      // console.log(that.data.killArr)
      if (!that.data.group) return;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = that.data.group.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              i = _step2$value[0],
              v = _step2$value[1];

          var nowData = new Date().getTime(); // 毫秒数
          // console.log('startTime', new Date(that.data.killArr[i].startTime))
          // let startTime = that.data.list[i].start_time * 1000
          var endTime = that.data.group[i].end_time;
          // console.log(endTime)
          // console.log(nowData, startTime, endTime)
          if (that.data.info.group_num <= v.user.length) {
            if (that.data.group[i].status === 2) {
              ++shutDown;
              continue;
            }
            that.data.group[i].status = 2;
            that.data.group[i].h = '已';
            that.data.group[i].m = '结';
            that.data.group[i].s = '束';
          } else if (nowData < endTime) {
            // 进行中
            that.data.group[i].status = 1;
            that.data.group[i].h = Math.floor((endTime - nowData) / 3600000);
            that.data.group[i].m = Math.floor((endTime - nowData) % 3600000 / 60000);
            that.data.group[i].s = Math.floor((endTime - nowData) % 60000 / 1000);
          } else {
            // 已结束
            if (that.data.group[i].status === 2) {
              ++shutDown;
              continue;
            }
            that.data.group[i].status = 2;
            that.data.group[i].h = '已';
            that.data.group[i].m = '结';
            that.data.group[i].s = '束';
          }
          that.setData({
            group: that.data.group
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

      if (shutDown === that.data.group.length) clearInterval(timer);
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
          if (that.data.options.oid) {
            that.setData({
              group: that.data.group,
              more: 1
            }, that.setKill());
            return;
          }
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

                  s.phone = s.phone.substr(0, 3) + '****' + s.phone.substr(7);
                  if (s.mode_id <= 1) {
                    // 团长
                    teamTemp['group_id'] = s.group_id;
                    teamTemp['end_time'] = (s.create_time * 1 + that.data.info.effective_time * 1) * 1000;
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
            group: that.data.group.concat(tempList),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          }, that.setKill());
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  showMorePing: function showMorePing() {
    if (this.data.more > 0) this.getPingTeam();else app.setToast(this, { content: '没有更多拼团啦' });
  },

  // 获取单独拼团信息
  getpinglaunch: function getpinglaunch(oid, mid) {
    // return this.shopProduct(5)
    var that = this;
    app.wxrequest({
      url: app.getUrl().pinglaunch,
      data: {
        oid: oid,
        uid: app.gs('userInfoAll').id,
        mid: mid
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var teamTemp = {
            user: []
          };
          var groupL = {};
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = res.data.data.group[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var s = _step5.value;

              s.phone = 'Ta向你分享的拼团';
              if (s.mode_id <= 1) {
                // 团长
                teamTemp['group_id'] = s.group_id;
                teamTemp['end_time'] = (s.create_time * 1 + res.data.data.product.effective_time * 1) * 1000;
                groupL = s;
              } else {
                teamTemp.user.push(s);
              }
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

          teamTemp.user.unshift(groupL);
          that.setData({
            group: that.data.group.concat(teamTemp)
          }, function () {
            that.shopProduct(res.data.data.product.id);
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
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
      if (options.share) scene = options.share.split(',');
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
    if (timer) clearInterval(timer);
    if (timer2) clearInterval(timer2);
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});