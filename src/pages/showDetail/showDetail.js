// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    placeholder: '输入您的评论'
  },
  showMore () {
    this.setData({
      moreOperation: !this.data.moreOperation
    })
  },

  reply (e) {
    if (e.currentTarget.dataset.type === 'send') {
      this.setData({
        replyText: ''
      })
    } else if (e.currentTarget.dataset.type === 'other') {
      this.setData({
        placeholder: '回复xxxx:'
      })
    } else {
      this.setData({
        placeholder: '输入您的评论'
      })
    }
    this.setData({
      replyShow: !this.data.replyShow,
      focus: !this.data.focus
    })
  },
  inputValue (e) {
    this.setData({
      replyText: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.getSelf(this)
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
