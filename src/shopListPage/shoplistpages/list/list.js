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
    list: [],
    img: app.data.testImg
  },
  chooseLabel (e) {
    this.data.page = 0
    this.data.list = []
    this.setData({
      goodslabel: this.data.goodslabel,
      labelIndex: e.currentTarget.dataset.index
    }, this.getShopProduct)
  },
  getShopProduct () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: 0,
        page: ++that.data.page,
        cid: that.data.goodslabel[that.data.labelIndex].id
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
  upFormId (e) {
    app.upFormId(e)
  },
  onShareAppMessage () {
    return {
      title: `向您推荐店铺【${app.gs('shopInfoAll').name}】`,
      imageUrl: `${app.gs('shopInfoAll').avatar || ''}`,
      path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}`
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.setData({
      goodslabel: app.gs('shopLabel')
    }, this.getShopProduct)
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
    if (this.data.more > 0) this.getShopProduct()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.data.page = 0
    this.data.list = []
    this.getShopProduct()
    // TODO: onPullDownRefresh
  }
})
