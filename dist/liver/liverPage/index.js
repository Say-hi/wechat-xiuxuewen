// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    page: 0,
    currentIndex: 0
  },
  onShareAppMessage () {},
  onReachBottom () {
    // if (this.data.more >= 1) this.getList();else app.setToast(this, { content: '没有更多内容啦' });
  },
  getList () {
    const that = this
    app.wxrequest({
      url: 'https://teach.idwenshi.com/teaching/public/index.php/live/rooms',
      data: {},
      success (res) {
        that.setData({
          lists: res.data.data.datas
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getList()
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
    // this.data.lists = [];
    // page = 0;
    // this.getList();
    // TODO: onPullDownRefresh
  }
})
