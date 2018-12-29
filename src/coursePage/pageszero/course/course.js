// 获取全局应用程序实例对象
const app = getApp()
let page = 0
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabNav: app.data.label,
    lists: [],
    currentIndex: 0
  },

  chooseIndex (e) {
    app.setBar(e.currentTarget.dataset.text)
    this.data.lists = []
    page = 0
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    }, this.getList)
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
  },
  getList () {
    let that = this
    app.wxrequest({
      url:  that.data.options.type === 'search' ? app.getUrl().courseSearch : app.getUrl().course,
      data: that.data.options.type === 'search' ? {
          page: ++page,
          title: that.data.searchText
        } : {
        label: app.data.label[that.data.currentIndex].label,
        page: ++page
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
    if (app.data.searchText) {
      this.data.searchText = app.data.searchText
      app.data.searchText = null
    }
    app.setBar(options.type === 'search' ? '搜索课程' : app.data.label[0].t)
    page = 0
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
