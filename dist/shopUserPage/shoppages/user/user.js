'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_bg: '',
    systemVersion: app.data.systemVersion,
    img: app.data.testImg,
    erweima: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/publicy/qrcode_for_gh_66d80c7d342c_258.jpg',
    today: true
  },
  showImage: function showImage() {
    this.setData({
      showImage: !this.data.showImage
    });
  },
  saveImage: function saveImage() {
    var that = this;
    wx.showLoading({
      title: '图片保存中',
      mask: true
    });
    wx.downloadFile({
      url: that.data.erweima,
      success: function success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function success() {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功'
            });
            that.showImage();
          },
          fail: function fail() {
            wx.hideLoading();
            wx.showModal({
              title: '保存失败',
              content: '请搜索公众号【焕颜季】',
              showCancel: false
            });
            that.showImage();
          }
        });
      }
    });
  },
  getUser: function getUser() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.su('userInfoAll', res.data.data);
          that.setData({
            info: res.data.data,
            agents: res.data.data.mall_is > 0
          }, that.shopInfo);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  shopInfo: function shopInfo() {
    var that = this;
    if (!this.data.info.mall_id && !this.data.agents) return;
    app.wxrequest({
      url: app.getUrl().shopInfo,
      data: {
        mid: that.data.agents ? that.data.info.id : that.data.info.mall_id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.su('shopInfoAll', res.data.data);
          that.setData({
            shopInfo: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  chooseDay: function chooseDay(e) {
    this.setData({
      today: e.currentTarget.dataset.type === 'today',
      move: this.data.move === 'rotatetab' ? 'null' : 'rotatetab'
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
  getUserInfoBtn: function getUserInfoBtn(res) {
    if (res.detail.iv) app.wxlogin();
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
    this.getUser();
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
    this.getUser();
    // TODO: onPullDownRefresh
  }
});