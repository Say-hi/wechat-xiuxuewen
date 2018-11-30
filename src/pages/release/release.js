// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tipsArr: [
      {
        t: 'asdf'
      },
      {
        t: '啊撒旦看风景'
      }
    ],
    testImg: app.data.testImg,
    content: 0
  },
  inputValue (e) {
    this.setData({
      content: e.detail.value
    })
  },
  chooseTip (e) {
    this.data.tipsArr[e.currentTarget.dataset.index]['choose'] = !this.data.tipsArr[e.currentTarget.dataset.index]['choose']
    this.setData({
      tipsArr: this.data.tipsArr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    })
    app.setBar(options.type || '发布问题')
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
