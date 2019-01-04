// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    top_bg_1: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/storeSide/shop_bg_1.png',
    top_bg_2: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/storeSide/shop_bg_2.png',
    tabArr: ['视频课程', '线下课程'],
    tabIndex: 0,
    page: 0,
    tabNav: app.data.label,
    testImg: app.data.testImg,
    lists: [],
    currentIndex: 0
  },
  chooseIndex (e) {
    app.setBar(e.currentTarget.dataset.text)
    this.data.lists = []
    this.data.page = 0
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    }, this.getList)
  },
  getList () {
    let that = this
    app.wxrequest({
      url: that.data.tabIndex * 1 === 0 ? app.getUrl().teacherUserVideo : app.getUrl().teacherUserActive,
      data: {
        user_id: app.gs('userInfoAll').id,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            lists: that.data.lists.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onReachBottom () {
    if (this.data.more >= 1) this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('视频课程')
    this.setData({
      options
    }, this.getList)
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
    this.data.lists = []
    page = 0
    this.getList()
    // TODO: onPullDownRefresh
  }
})
