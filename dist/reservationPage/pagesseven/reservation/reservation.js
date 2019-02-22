'use strict';

// 获取全局应用程序实例对象
var app = getApp();
var bmap = require('../../../utils/bmap-wx');
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'reservation',
    testImg: app.data.testImg
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText') || '绣学问，真纹绣',
      path: '/pages/index/index'
    };
  },

  /**
   * 地址授权
   * @param e
   */
  open_site: function open_site(e) {
    console.log('setting');
    if (e.detail.authSetting['scope.userLocation']) {
      wx.showToast({
        title: '授权成功'
      });
      this.setData({
        openType: null
      });
      this.Bmap(this);
    }
  },
  choose_site: function choose_site() {
    console.log('choose');
    var that = this;
    if (!this.data.openType) {
      wx.chooseLocation({
        success: function success(res) {
          that.setData({
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }, that.Bmap(that, res.longitude + ',' + res.latitude));
        }
      });
    }
  },

  /**
   * 百度地图函数
   * @param that
   * @constructor
   */
  Bmap: function Bmap(that, site) {
    var _this = this;
    var BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    });
    BMap.weather({
      fail: function fail(data) {
        that.setData({
          openType: 'openSetting'
        });
        console.log('fail', data);
      },
      success: function success(data) {
        var type = new Date().getHours() > 18 || new Date().getHours() < 6 ? 'nightPictureUrl' : 'dayPictureUrl';
        that.setData({
          weatherInfo: data.originalData.results[0],
          weatherPic: data.originalData.results[0].weather_data[0][type].replace('http://', 'https://')
        });
      },

      location: site || null
    }, _this);
    BMap.regeocoding({
      location: site || null,
      success: function success(res) {
        that.setData({
          addressInfo: res
        });
      },
      fail: function fail(err) {
        console.log(err);
      }
    });
  },

  /**
   * 选择城市
   */
  chooseCity: function chooseCity() {
    var that = this;
    wx.chooseLocation({
      success: function success(res) {
        var site = res.longitude + ',' + res.latitude;
        that.Bmap(that, site);
      },
      cancel: function cancel(res) {
        console.log(res);
      },
      fail: function fail(res) {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    this.Bmap(this);
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
//# sourceMappingURL=reservation.js.map
