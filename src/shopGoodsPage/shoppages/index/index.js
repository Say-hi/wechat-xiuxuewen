// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectAll: -1, // -2 全选中
    img: app.data.testImg,
    list: [
      {
        num: 1,
        price: '22.00',
        image: app.data.testImg,
        title: '我是视频标题我是视频标题我是视频标题'
      },
      {
        num: 1,
        price: '222.00',
        image: app.data.testImg,
        title: '我是视频标题'
      }
    ],
    tabIndex: 0
  },
  goEdit (e) {
    wx.navigateTo({
      url: '/shopEditPage/shoppages/index/index'
    })
  },
  tabChoose (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index * 1
    }, this.setBar)
  },
  del () {
    let newList = []
    for (let v of this.data.list) {
      if (!v['choose']) newList.push(v)
    }
    this.setData({
      list: newList
    })
  },
  choose (e) {
    if (e.currentTarget.dataset.index < 0) this.checkAll()
    let that = this
    let str = `list[${e.currentTarget.dataset.index}].choose`
    this.setData({
      [str]: !that.data.list[e.currentTarget.dataset.index].choose
    }, that.checkAll)
  },
  checkAll (e) {
    let that = this
    if (e) {
      for (let v of this.data.list) {
        v['choose'] = this.data.selectAll === -1
      }
      this.data.selectAll = this.data.selectAll === -1 ? -2 : -1
    } else {
      this.data.selectAll = -2
      for (let v of this.data.list) {
        if (!v['choose']) this.data.selectAll = -1
      }
    }
    this.setData({
      list: that.data.list,
      selectAll: that.data.selectAll
    })
  },
  onShareAppMessage () {
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: `/pages/index/index`,
        imageUrl: app.gs('shareText').g
      }
    } else {
      return {
        title: `向您推荐店铺【${app.gs('shopInfoAll').name}】`,
        imageUrl: `${app.gs('shopInfoAll').avatar || ''}`,
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}`
      }
    }
  },
  setBar () {
    if (this.data.tabIndex === 0) app.setBar('出售中的商品')
    else if (this.data.tabIndex === 1) app.setBar('仓库中的商品')
    else if (this.data.tabIndex === 2) app.setBar('库存紧张的商品')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      tabIndex: options.type * 1
    }, this.setBar)

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
