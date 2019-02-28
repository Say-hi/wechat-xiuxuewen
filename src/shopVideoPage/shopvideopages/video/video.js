// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    labelIndex: 0,
    page: 0,
    playIndex: -1,
    img: app.data.testImg,
    list: []
  },
  getVideo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopVideoList,
      data: {
        cid: that.data.goodslabel[that.data.labelIndex].id,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            list: that.data.list.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  chooseLabel (e) {
    this.data.page = 0
    this.data.list = []
    this.setData({
      playIndex: -1,
      labelIndex: e.currentTarget.dataset.index
    }, this.getVideo)
  },
  playVideo (e) {
    let that = this
    app.videoCount(this.data.list[e.currentTarget.dataset.index].id)
    that.setData({
      playIndex: e.currentTarget.dataset.index
    })
  },
  upFormId (e) {
    app.upFormId(e)
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
  onLoad () {
    this.setData({
      goodslabel: app.gs('shopLabel')
    }, this.getVideo)
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
  onReachBottom () {
    if (this.data.more > 0) this.getVideo()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.data.page = 0
    this.data.list = []
    this.setData({
      playIndex: -1
    })
    this.getVideo()
    // TODO: onPullDownRefresh
  }
})
