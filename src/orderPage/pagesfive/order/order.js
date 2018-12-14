// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    currentIndex: 0,
    currentIndexTwo: 0,
    teamOrder: ['拼团中', '拼团成功', '拼团失败'],
    videoTab: [
      {
        t: '待付款'
      },
      {
        t: '待收货'
      },
      {
        t: '已完成'
      }
    ]
  },
  chooseIndex (e) {
    if (e.currentTarget.dataset.type === 'team') {
      this.setData({
        currentIndexTwo: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }
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
