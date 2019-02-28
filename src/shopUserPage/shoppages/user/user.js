// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: app.data.testImg,
    today: true
  },
  getUser () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            info: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  chooseDay (e) {
    this.setData({
      today: e.currentTarget.dataset.type === 'today'
    })
  },
  onShareAppMessage () {
    let that = this
    return {
      title: `向您推荐店铺【${that.data.info.name}】`,
      imageUrl: `${that.data.info.avatar || ''}`,
      path: `/shopPage/shoppages/index/index?mid=${that.data.id}`
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.getUser()
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
