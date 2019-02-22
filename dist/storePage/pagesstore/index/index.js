'use strict';

// 获取全局应用程序实例对象
var app = getApp();
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabNav: [{
      t: '发布课程',
      url: '../releasePage/releaseCourse/releaseCourse',
      img: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/storeSide/index_1.png'
    }, {
      t: '我的课程',
      url: '../coursePage/course/course',
      img: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/storeSide/index_2.png'
    }, {
      t: '分享有奖',
      url: '/sharePage/pagesshare/share/share',
      img: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/storeSide/index_3.png'
    }],
    testImg: app.data.testImg
  },
  upFormId: function upFormId(e) {
    app.upFormId(e);
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
          app.su('roomInfo', res.data.data);
          if (res.data.data) {
            that.data.hasShop = 1;
          } else {
            that.data.hasShop = 0;
          }
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  tabO: function tabO(e) {
    if (this.data.hasShop === 0) return app.setToast(this, { content: '请先设置您的教室信息' });else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    }
  },
  getMsg: function getMsg() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().teacherActiveMsg,
      data: {
        user_id: app.gs('userInfoAll').id,
        num: 3
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              v.create_time = app.moment(v.create_time * 1000);
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
            MSG: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  getInfo: function getInfo() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().userInfo,
      data: {
        user_id: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.su('userInfoAll', res.data.data);
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
    app.setBar('首页');
    this.getInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    // console.log(' ---------- onReady ----------')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    this.getRoomInfo();
    this.getMsg();
    this.setData({
      move: !this.data.move
    });
    // console.log(' ---------- onShow ----------')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    this.setData({
      move: !this.data.move
    });
    // console.log(' ---------- onHide ----------')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {

    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage: function onShareAppMessage() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    this.getRoomInfo();
    this.getInfo();
  }
});
//# sourceMappingURL=index.js.map
