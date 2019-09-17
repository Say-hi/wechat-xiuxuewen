'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftIndex: 0,
    leftPage: 0,
    leftList: [],
    rightPage: 0,
    rightList: []
  },
  choose: function choose(e) {
    app.setBar(this.data.leftList[e.currentTarget.dataset.index].title);
    this.data.rightMore = false;
    this.data.rightPage = 0;
    this.data.rightList = [];
    this.setData({
      leftIndex: e.currentTarget.dataset.index
    }, this.getRightList);
  },
  getLeftList: function getLeftList() {
    var that = this;
    if (this.data.leftMore) return;
    app.wxrequest({
      url: app.getUrl().scMenu,
      data: {
        page: ++that.data.leftPage,
        rank: 1,
        parent_id: 0
      },
      success: function success(res) {
        if (res.data.status) {
          that.setData({
            leftList: that.data.leftList.concat(res.data.data.lists),
            leftMore: res.data.data.pre_page > res.data.data.lists.length
          }, that.getRightList);
        }
      }
    });
  },
  goDetail: function goDetail(e) {
    app.su('listArr', this.data.rightList);
    app.su('rightIndex', e.currentTarget.dataset.index);
    app.su('rightPage', this.data.rightPage);
    wx.navigateTo({
      url: '../scDetail/scDetail?t=' + this.data.rightList[e.currentTarget.dataset.index].title + '&index=' + e.currentTarget.dataset.index
    });
  },
  getRightList: function getRightList() {
    var that = this;
    if (this.data.rightMore) return;
    app.wxrequest({
      url: app.getUrl().scMenu,
      data: {
        page: ++that.data.rightPage,
        rank: 2,
        parent_id: that.data.leftList[that.data.leftIndex].id
        // mid: that.data.leftList[that.data.leftIndex].id
      },
      success: function success(res) {
        if (res.data.status) {
          wx.hideLoading();
          that.setData({
            rightList: that.data.rightList.concat(res.data.data.lists),
            rightMore: res.data.data.pre_page > res.data.data.lists.length
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    this.getLeftList();
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