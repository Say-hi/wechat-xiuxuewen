// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    videoTab: [
      {
        t: '课程列表'
      },
      {
        t: '老师介绍'
      }
    ],
    reservation_bg: app.data.reservation_bg,
    testImg: app.data.testImg
  },
  onShareAppMessage () {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: `/pages/index/index`,
      imageUrl: app.gs('shareText').g
    }
  },
  chooseIndex (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
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
