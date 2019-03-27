// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    list: []
  },
  call (e) {
    app.call(e.currentTarget.dataset.phone.toString())
  },
  search (e) {
    this.data.page = 0
    this.data.list = []
    this.setData({
      searchText: e.detail.target ? e.detail.value.search : e.detail.value
    }, this.getList)
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
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}&user=${app.gs('userInfoAll').id}`
      }
    }
  },
  getList () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopTeam,
      data: {
        mid: app.gs('shopInfoAll').id,
        page: ++that.data.page,
        uid: that.data.type === 'user' ? app.gs('userInfoAll').id : 0,
        name: that.data.searchText || ''
      },
      success (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v.mall_create_time = app.momentFormat(v.mall_create_time * 1000, 'YYYY.MM.DD')
          }
          that.setData({
            list: that.data.list.concat(res.data.data.lists),
            total: res.data.data.total,
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.data.type = options.type
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
  onReachBottom () {
    if (this.data.more > 0) this.getList()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.data.page = 0
    this.data.list = []
    this.getList()
    // TODO: onPullDownRefresh
  }
})
