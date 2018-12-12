// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rIndex: -1,
    testImg: app.data.testImg,
    commentArr: []
  },
  // 用户回复操作
  replyOperation (e) {
    if (this.data.replyFocus) return
    this.setData({
      replyName: e.currentTarget.dataset.name,
      rIndex: e.currentTarget.dataset.cindex,
      replyFocus: true
    })
  },
  replyBlur (e) {
    console.log(e)
    this.setData({
      rIndex: -1,
      replyFocus: false
    })
  },

  onShareAppMessage () {
    return {
      title: '分享了一个问答',
      path: '/answerPage/pagesthree/answerDetail/answerDetail?id=12'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.log(options)
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
