// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabArr: ['积分记录', '支票记录'],
    tabIndex: 0,
    list: [],
    page: 0
  },
  getscore () {
    let that = this
    app.wxrequest({
      url: app.getUrl()[that.data.tabIndex < 1 ? 'userscore' : 'userrecharge'],
      data: {
        uid: app.gs('userInfoAll').mall_is > 0 ? app.gs('shopInfoAll').id : app.gs('userInfoAll').id,
        mid: app.gs('shopInfoAll').id,
        // uid: 10014,
        // mid: 10000,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v.create_time = app.momentFormat(v.create_time * 1000, 'YYYY-MM-DD HH:mm:ss')
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
  tabChoose (e) {
    this.data.page = 0
    this.data.list = []
    this.setData({
      tabIndex: e.currentTarget.dataset.type
    }, this.getscore)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // TODO: onLoad
    if (options.text) {
      app.setBar(options.text)
    }
    this.setData({
      options,
      tabIndex: options.t
    }, this.getscore)
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
