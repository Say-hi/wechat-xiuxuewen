'use strict';

// 获取全局应用程序实例对象
var app = getApp();
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'collage',
    openType: 'share',
    page: 0,
    lists: [],
    testImg: app.data.testImg
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
  },
  getList: function getList() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().teacherUserIncome,
      data: {
        user_id: app.gs('userInfoAll').id,
        page: ++that.data.page
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

              v.create_time = app.momentFormat(v.create_time * 1000, 'YYYY年MM月DD日 HH:SS');
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
            lists: that.data.lists.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onReachBottom: function onReachBottom() {
    if (this.data.more >= 1) this.getList();else app.setToast(this, { content: '没有更多内容啦' });
  },
  moneyOut: function moneyOut() {
    var that = this;
    if (that.data.userInputMoney <= 0.1) return app.setToast(this, { content: '提现金额不能小于0.1元' });
    app.wxrequest({
      url: app.getUrl().teacherUserCash,
      data: {
        user_id: app.gs('userInfoAll').id,
        openid: app.gs(),
        amount: that.data.userInputMoney
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          wx.showToast({
            title: '申请成功'
          });
          that.moneyOperation({
            currentTarget: {
              dataset: {
                type: 'change'
              }
            }
          });
          that.getRoomInfo();
        } else {
          app.setToast(that, { content: res.data.desc });
          that.moneyOperation({
            currentTarget: {
              dataset: {
                type: 'change'
              }
            }
          });
          that.getRoomInfo();
        }
      }
    });
  },
  moneyOperation: function moneyOperation(e) {
    if (e.currentTarget.dataset.type === 'confirm') {
      this.moneyOut();
    } else {
      this.setData({
        getMoneyShow: !this.data.getMoneyShow
      });
    }
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
          that.setData({
            putMoney: res.data.data.put_money,
            totalFee: res.data.data.total_fee
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  outMoney: function outMoney(e) {
    var that = this;
    console.log(e);
    that.setData({
      userInputMoney: e.detail.value * 1 > that.data.totalFee ? that.data.totalFee : e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    app.setBar('我的收益');
    this.getList();
    this.getRoomInfo();
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
    this.data.page = 0;
    this.data.lists = [];
    this.getList();
    // TODO: onPullDownRefresh
  }
});
//# sourceMappingURL=income.js.map
