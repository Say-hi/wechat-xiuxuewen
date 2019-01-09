// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    page: 0,
    sysIndex: -1,
    lists: []
  },
  getSys () {
    let that = this
    app.wxrequest({
      url: app.getUrl().teacherUserSysDetail,
      data: {
        id: that.data.lists[that.data.sysIndex].id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          res.data.data.create_time = app.momentFormat(res.data.data.create_time * 1000, 'YYYY年MM月DD日 HH:MM')
          app.WP('desc', 'html', res.data.data.context, that, 30)
          that.setData({
            sysInfo: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  goDetail (e) {
    if (e.currentTarget.dataset.type === 'close') {
      return this.setData({
        sysIndex: -1
      })
    }
    if (e.currentTarget.dataset.type === 'sys') {
      console.log(1)
      this.setData({
        sysIndex: e.currentTarget.dataset.index
      }, this.getSys)
    } else {
      wx.navigateTo({
        url: `/coursePage/pageszero/courseDetail/courseDetail?id=${e.currentTarget.dataset.id}&type=1`
      })
    }
  },
  getList () {
    let that = this
    let type = this.data.options.type
    app.wxrequest({
      url: app.getUrl()[type === '系统通知' ? 'teacherUserSys' : type === '评论' ? 'teacherUserEvaluateMsg' : 'teacherUserVideoCollect'],
      data: {
        user_id: app.gs('userInfoAll').id,
        page: ++this.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v.create_time = app.momentFormat(v.create_time * 1000, 'YYYY年MM月DD日 HH:MM')
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
    if (this.data.more >= 1) this.getList()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    }, this.getList)
    app.setBar(options.type)
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
    this.getList()
    // TODO: onPullDownRefresh
  }
})
