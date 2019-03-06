'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    currentIndex: 0,
    currentIndexTwo: 0,
    teamOrder: ['拼团中', '拼团成功', '拼团失败'],
    videoTab: [{
      t: '待付款'
    }, {
      t: '待收货'
    }, {
      t: '已完成'
    }]
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  chooseIndex: function chooseIndex(e) {
    this.data.lists = [];
    this.data.page = 0;
    if (e.currentTarget.dataset.type === 'team') {
      this.setData({
        currentIndexTwo: e.currentTarget.dataset.index
      });
    } else {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      }, this.getData);
    }
  },
  getData: function getData() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().userActivePay,
      data: {
        // user_id: 2,
        user_id: app.gs('userInfoAll').id,
        page: ++that.data.page,
        status: that.data.currentIndex * 1 === 0 ? 0 : that.data.currentIndex * 1 === 1 ? 6 : 3
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              v.create_time = app.momentFormat(v.create_time * 1000, 'MM月DD日 HH:mm');
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
            lists: that.data.lists ? that.data.lists.concat(res.data.data.lists) : res.data.data.lists,
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  pay: function pay(orderId, index) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().payActiveAgain,
      data: {
        order_id: orderId,
        openid: app.gs()
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.wxpay(Object.assign(res.data.data.msg, {
            success: function success() {
              that.data.lists.splice(index, 1);
              that.setData({
                lists: that.data.lists
              });
              wx.navigateTo({
                url: '/offlinePage/pagesnine/offlineApply/offlineApply?trade=' + that.data.lists[index].out_trade_no + '&id=' + that.data.lists[index].id
              });
            },
            fail: function fail() {
              app.setToast(that, { content: '未完成支付' });
            }
          }));
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  orderOperation: function orderOperation(e) {
    if (e.currentTarget.dataset.type === 'pay') {
      return this.pay(e.currentTarget.dataset.id, e.currentTarget.dataset.index);
    }
    var that = this;
    app.wxrequest({
      url: app.getUrl().userActiveChange,
      data: {
        // user_id: 2,
        user_id: app.gs('userInfoAll').id,
        out_trade_no: that.data.lists[e.currentTarget.dataset.index].out_trade_no,
        style: e.currentTarget.dataset.type === 'cancel' ? 1 : e.currentTarget.dataset.type === 'del' ? 2 : 3
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.lists.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            lists: that.data.lists
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onReachBottom: function onReachBottom() {
    if (this.data.more > 0) this.getData();else app.setToast(this, { content: '没有更多订单啦' });
  },
  showScroll: function showScroll(e) {
    var that = this;
    if (e.currentTarget.dataset.type === 'check') {
      that.setData({
        showS: !that.data.showS
      });
    } else {
      app.wxrequest({
        url: app.getUrl().userLogistic,
        data: {
          out_trade_no: e.currentTarget.dataset.id,
          order_num: e.currentTarget.dataset.logistic
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            that.setData({
              showS: !that.data.showS,
              express: res.data.data.data
            });
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    this.getData();
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