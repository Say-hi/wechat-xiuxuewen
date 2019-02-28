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
    poster: app.data.testImg,
    page: 0,
    lists: [],
    videoTab: [
      {
        t: '未预约'
      },
      {
        t: '进行中'
      },
      {
        t: '已结束'
      }
    ]
  },
  onShareAppMessage () {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: `/pages/index/index`,
      imageUrl: app.gs('shareText').g
    }
  },
  showMore (e) {
    this.setData({
      canShowIndex: e.currentTarget.dataset.index
    })
  },
  goMapPoint (e) {
    wx.openLocation({
      scale: 10,
      ...(e.currentTarget.dataset)
    })
  },
  chooseIndex (e) {
    this.data.page = 0
    this.data.lists = []
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    }, this.getUserBuyCourse)
  },
  getUserBuyCourse () {
    let that = this
    app.wxrequest({
      url: that.data.options.type * 1 === 1 ? app.getUrl().userActive : app.getUrl().userCollect,
      data: {
        user_id: app.gs('userInfoAll').id,
        page: ++that.data.page,
        state: that.data.options.type * 1 === 1 ? that.data.currentIndex * 1 === 0 ? 3 : that.data.currentIndex : that.data.currentIndex * 1 + 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            if (v.make_time) v.make_time = app.momentFormat(v.make_time * 1000, 'YYYY.MM.DD')
            if (v.room_images) v.room_images = v.room_images.split(',')
            if (that.data.resLl && v.latitude) {
              let distance = app.distance(v.latitude, v.longitude, that.data.resLl.latitude, that.data.resLl.longitude)
              v.distance = distance > 1000 ? (distance / 1000).toFixed(2) + 'km' : distance + 'm'
            }
            if (v.create_time) v.create_time = app.momentFormat(v.create_time * 1000, 'YYYY年MM月DD日 HH:mm:ss')
            if (v.images) v.images = v.images.split(',')
          }
          that.setData({
            lists: that.data.lists.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onReachBottom () {
    if (!this.data.more) return app.setToast(this, {content: '没有更多内容了'})
    this.getUserBuyCourse()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    let that = this
    wx.getLocation({
      success (res) {
        that.setData({
          resLl: res
        })
      }
    })
    this.setData({
      options,
      currentIndex: options.cur || 0
    }, this.getUserBuyCourse)
    if (options.type >= 2) {
      this.setData({
        videoTab: [
          {
            t: '教学视频'
          },
          {
            t: '教室'
          },
          {
            t: '线下课程'
          },
          {
            t: '问答'
          }
        ]
      })
    }
    app.setBar(options.type * 1 === 1 ? '我的预约' : '收藏')
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
    this.data.page = 0
    this.data.lists = []
    this.getUserBuyCourse()
    // TODO: onPullDownRefresh
  }
})
