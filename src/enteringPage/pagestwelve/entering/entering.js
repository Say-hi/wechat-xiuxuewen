// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    giftIndex: 0,
    bgcS: '#FDA36E',
    bgcE: '#F48280',
    title: 'entering'
  },
  chooseGift (e) {
    app.WP('ruler', 'html', this.data.lists[e.currentTarget.dataset.index].rule, this, 5)
    this.setData({
      giftIndex: e.currentTarget.dataset.index
    })
  },
  openGift () {
    this.setData({
      open: !this.data.open
    })
  },
  getlists () {
    let that = this
    app.wxrequest({
      url: app.getUrl().userGift,
      data: {
        style: that.data.tabIndex * 1 + 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.WP('ruler', 'html', res.data.data[0].rule, that, 5)
          that.setData({
            lists: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  noup () {},
  rulerChange () {
    this.setData({
      rulerShow: !this.data.rulerShow
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getlists()
    if (options && options.id) {
      app.wxlogin(options.id)
    }
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
