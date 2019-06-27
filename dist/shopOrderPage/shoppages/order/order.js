'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    tabIndex: 0,
    discount_name: app.gs('shopInfoAll').rule.state_name,
    discount_value: app.gs('shopInfoAll').rule.discount,
    tabNav: [{
      t: '全部',
      i: 0
    }, {
      t: '待付款',
      i: -1
    }, {
      t: '待发货',
      i: 1
    }, {
      t: '待收货',
      i: 2
    }, {
      t: '已完成',
      i: 3
    }],
    list: []
  },
  copy: function copy(e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.list[e.currentTarget.dataset.index][e.currentTarget.dataset.type],
      success: function success(res) {
        wx.showToast({
          title: '复制成功'
        });
      }
    });
  },
  showExpress: function showExpress(e) {
    this.setData({
      expressObj: {
        out_trade_no: this.data.list[e.currentTarget.dataset.index].out_trade_no,
        order_num: this.data.list[e.currentTarget.dataset.index].order_num
      }
    });
  },
  tabChoose: function tabChoose(e) {
    this.data.page = 0;
    this.data.list = [];
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    }, this.getList);
  },
  getList: function getList() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserOrders,
      data: {
        uid: that.data.options.for === 'user' ? app.gs('userInfoAll').id : 0,
        // uid: that.data.options.for === 'user' ? 2 : 0,
        status: that.data.tabNav[that.data.tabIndex].i,
        page: ++that.data.page,
        mid: that.data.options.for === 'user' ? 0 : app.gs('shopInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var id = app.gs('userInfoAll').id * 1;
          // let id = 2
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              v.create_time = app.momentFormat(v.create_time * 1000, 'MM月DD日 HH:mm');
              v['self'] = v.uid * 1 === id;
              v['all_count'] = 0;
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = v.list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var s = _step2.value;

                  v['all_count'] += s.count * 1;
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
            list: that.data.list.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  change: function change(e) {
    var that = this;
    var state = that.data.list[e.currentTarget.dataset.index].status < 0 && that.data.options.for === 'user' ? 4 : that.data.list[e.currentTarget.dataset.index].status * 1 === 2 ? 3 : '';
    app.wxrequest({
      url: app.getUrl().shopUserOperate,
      data: {
        oid: that.data.list[e.currentTarget.dataset.index].id,
        uid: that.data.list[e.currentTarget.dataset.index].uid,
        mid: that.data.list[e.currentTarget.dataset.index].mid,
        state: state
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (that.data.tabIndex <= 0 && state !== 4) {
            that.setData(_defineProperty({}, 'list[' + e.currentTarget.dataset.index + '].status', state));
          } else {
            that.data.list.splice(e.currentTarget.dataset.index, 1);
            that.setData({
              list: that.data.list
            });
          }
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  fahuo: function fahuo(e) {
    this.setData({
      fahuomask: !this.data.fahuomask,
      fahuoIndex: e ? e.currentTarget.dataset.index : -1
    });
  },
  deliver: function deliver(e) {
    var that = this;
    if (e.detail.value.name.length < 1) return app.setToast(this, { content: '请输入物流公司' });
    if (e.detail.value.num.length < 1) return app.setToast(this, { content: '请输入物流单号' });
    app.wxrequest({
      url: app.getUrl().shopExpress,
      data: {
        oid: that.data.list[that.data.fahuoIndex].id,
        mid: app.gs('shopInfoAll').id,
        logistics: e.detail.value.name,
        order_num: e.detail.value.num
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          wx.showToast({
            title: '发货成功'
          });
          if (that.data.tabIndex <= 0) {
            var _that$setData2;

            that.setData((_that$setData2 = {}, _defineProperty(_that$setData2, 'list[' + that.data.fahuoIndex + '].status', 2), _defineProperty(_that$setData2, 'fahuomask', false), _that$setData2));
          } else {
            that.data.list.splice(that.data.fahuoIndex, 1);
            that.setData({
              list: that.data.list,
              fahuomask: false
            });
          }
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  shareChange: function shareChange(e) {
    this.data.share_index = e.currentTarget.dataset.index;
    this.setData({
      showShare: !this.data.showShare
    });
  },
  payAgain: function payAgain(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopPayAgain,
      data: {
        oid: that.data.list[e.currentTarget.dataset.index].id,
        mid: that.data.list[e.currentTarget.dataset.index].mid,
        uid: app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.wxpay2(res.data.data.msg).then(function () {
            if (that.data.tabIndex > 0) {
              that.data.list.splice(e.currentTarget.dataset.index, 1);
              that.setData({
                list: that.data.list
              });
            } else {
              that.setData(_defineProperty({}, 'list[' + e.currentTarget.dataset.index + '].status', 1));
            }
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
  getMyShareCode: function getMyShareCode() {
    wx.previewImage({
      urls: ['https://c.jiangwenqiang.com/api/logo.jpg']
    });
  },
  onShareAppMessage: function onShareAppMessage() {
    if (this.data.ping && this.data.share_index >= 0) {
      return {
        title: '快来和我一起参团享好物吧',
        path: '/shopListPage/shoplistpages/detail/detail?id=' + this.data.list[this.data.share_index].list[0].id + '&ping=ping&from=' + app.gs('userInfoAll').id,
        imageUrl: this.data.list[this.data.share_index].list[0].img
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
  cancelping: function cancelping() {
    this.setData({
      cancelPing: !this.data.cancelPing
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    if (options.for === 'shop' && options.ping) {
      this.data.tabNav.push({
        t: '退款中',
        i: 4
      });
    }
    this.setData({
      options: options,
      ping: options.ping,
      tabIndex: options.type,
      tabNav: this.data.tabNav
    }, this.getList);
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
  onReachBottom: function onReachBottom() {
    if (this.data.more > 0) this.getList();else app.setToast(this, { content: '没有更多内容啦' });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    this.data.page = 0;
    this.data.list = [];
    this.getList();
    // TODO: onPullDownRefresh
  }
});