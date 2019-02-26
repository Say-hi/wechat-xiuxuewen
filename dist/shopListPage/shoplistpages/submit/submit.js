'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    img: app.data.testImg,
    specifi: [{
      t: 'color',
      chooses: [{
        t: '可可棕',
        id: 1
      }, {
        t: '可可棕',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }]
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
  submit: function submit() {
    this.setData({
      need_pay: !this.data.need_pay
    });
  },
  gohome: function gohome() {
    wx.reLaunch({
      url: '/shopPage/shoppages/index/index'
    });
  },
  onShareAppMessage: function onShareAppMessage() {
    var that = this;
    return {
      title: '' + (that.data.info.share_title || '邀请您入驻绣学问，成为优秀的纹绣人'),
      imageUrl: '' + (that.data.info.share_imageUrl || ''),
      path: '/enteringPage/pagestwelve/entering/entering?id=' + app.gs('userInfoAll').id
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
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
//# sourceMappingURL=submit.js.map
