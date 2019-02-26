// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    img: app.data.testImg,
    tabNav: ['全部', '待付款', '待发货', '待收货', '已完成'],
    list: [
      {
        image: app.data.testImg,
        title: '我是视频标题我是视频标题我是视频标题'
      },
      {
        image: app.data.testImg,
        title: '我是视频标题'
      },
      {
        image: app.data.testImg,
        title: '我是视频标题'
      },
      {
        image: app.data.testImg,
        title: '我是视频标题我是视频标题我是视频标题'
      },
      {
        image: app.data.testImg,
        title: '我是视频标题我是视频标题我是视频标题我是视频标题我是视频标题'
      }
    ]
  },
  showExpress (e) {
    this.setData({
      expressObj: {
        num: 123,
        id: 1
      }
    })
  },
  tabChoose (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  onShareAppMessage () {
    let that = this
    return {
      title: `${that.data.info.share_title || '邀请您入驻绣学问，成为优秀的纹绣人'}`,
      imageUrl: `${that.data.info.share_imageUrl || ''}`,
      path: `/enteringPage/pagestwelve/entering/entering?id=${app.gs('userInfoAll').id}`
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      tabIndex: options.type
    })
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
