// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    latitude: 23.111123,
    longitude: 113.123432,
    currentIndex: 0,
    poster: app.data.testImg,
    videoTab: [
      {
        t: '未开始'
      },
      {
        t: '正学习'
      },
      {
        t: '已结束'
      }
    ]
  },
  showMore (e) {
    this.setData({
      canShowIndex: e.currentTarget.dataset.index
    })
  },
  goMapPoint (e) {
    console.log(e.currentTarget.dataset)
    wx.openLocation({
      scale: 10,
      ...(e.currentTarget.dataset)
    })
  },
  chooseIndex (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    })
    if (options.type >= 2) {
      this.setData({
        videoTab: [
          {
            t: '教学视频'
          },
          {
            t: '教室'
          },
          {
            t: '线下课程'
          },
          {
            t: '问答'
          }
        ]
      })
    }
    app.setBar(options.type * 1 === 1 ? '我的预约' : '收藏')
    // TODO: onLoad
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
