// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 0
  },
  inputValue (e) {
    this.data.searchText = e.detail.value
  },
  getPinPic () {
    let that = this
    app.wxrequest({
      url: app.getUrl().pinenter,
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            pic: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  search () {
    let that = this
    if (!this.data.searchText || this.data.searchText.length <= 0) return app.setToast(this, {content: '请输入搜索的内容'})
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: app.gs('shopInfoAll').id,
        title: that.data.searchText
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (that.data.goodslabel[0].name !== '搜索') {
            that.data.goodslabel.unshift({
              name: '搜索'
            })
          }
          that.setData({
            labelIndex: 0,
            goodslabel: that.data.goodslabel,
            goods: res.data.data.lists
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },

  getList () {
    let that = this
    app.wxrequest({
      url: app.getUrl().pinlist,
      // url: app.getUrl().shopProductList,
      data: {
        mid: app.gs('shopInfoAll').id,
        page: ++that.data.page
      },
      success (res) {
        if (that.data.page === 1) wx.stopPullDownRefresh()
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v.price = v.price.split('.')
            // v.price = v.old_price.split('.')
          }
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
  onReachBottom () {
    if (this.data.more > 0) this.getList()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  onShareAppMessage () {
    let that = this
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: `/pages/index/index`,
        imageUrl: app.gs('shareText').g
      }
    } else {
      return {
        title: `向您推荐店铺【${that.data.info.name}】`,
        imageUrl: `${that.data.info.avatar || ''}`,
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}&user=${app.gs('userInfoAll').id}`
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getList()
    this.getPinPic()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // this.setData({
    //   move: !this.data.move
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // this.setData({
    //   move: !this.data.move
    // })
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
    this.data.list = []
    this.data.page = 0
    this.getList()
  }
})
