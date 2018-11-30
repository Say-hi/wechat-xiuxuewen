// 获取全局应用程序实例对象
const app = getApp()
const proportion = wx.getSystemInfoSync().windowWidth / 750
const HEIGHT = 100
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    height: HEIGHT,
    opacity: 1,
    videoTab: [
      {
        t: '热门提问'
      },
      {
        t: '最新提问'
      },
      {
        t: '我的提问'
      }
    ],
    testImg: app.data.testImg
  },
  getData () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  chooseIndex (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    }, this.getData)
  },
  onPageScroll (e) {
    let height = (HEIGHT - e.scrollTop * proportion) >= 100 ? 100 : (HEIGHT - e.scrollTop * proportion)
    this.setData({
      height,
      opacity: height <= 0 ? 0 : height / HEIGHT
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
