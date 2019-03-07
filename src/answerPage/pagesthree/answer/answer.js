// 获取全局应用程序实例对象
const app = getApp()
const proportion = wx.getSystemInfoSync().windowWidth / 750
const HEIGHT = 100
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    currentIndex: 0,
    height: HEIGHT,
    opacity: 1,
    videoTab: [
      {
        t: '热门提问'
      },
      {
        t: '最新提问'
      },
      {
        t: '我的提问'
      }
    ],
    lists: []
  },
  onShareAppMessage () {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: `/pages/index/index`,
      imageUrl: app.gs('shareText').g
    }
  },
  getData () {
    this.getList()
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  chooseIndex (e) {
    this.data.page = 0
    this.data.lists = []
    try {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      }, this.getData)
    } catch (err) {
      this.setData({
        currentIndex: 2
      }, this.getData)
    }
  },
  onPageScroll (e) {
    let height = (HEIGHT - e.scrollTop * proportion) >= 100 ? 100 : (HEIGHT - e.scrollTop * proportion)
    this.setData({
      height,
      opacity: height <= 0 ? 0 : height / HEIGHT
    })
  },
  getList (search) {
    let that = this
    let data = {}
    if (search) {
      this.data.page = 0
      this.data.lists = []
      this.setData({
        currentIndex: -1,
        search
      })
      data = {
        // user_id: app.gs('userInfoAll').id,
        page: ++this.data.page,
        ask: search
      }
    } else if (this.data.currentIndex * 1 === 1) {
      data = {
        page: ++this.data.page
      }
    } else if (this.data.currentIndex * 1 === 2) {
      data = {
        user_id: app.gs('userInfoAll').id,
        page: ++this.data.page
      }
    } else {
      data = {
        page: ++this.data.page
      }
    }
    app.wxrequest({
      url: (this.data.currentIndex * 1 === 1 || this.data.currentIndex * 1 === -1) ? app.getUrl().question : this.data.currentIndex * 1 === 0 ? app.getUrl().questionProblemHot : app.getUrl().questionProblemMy,
      data,
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v.create_time = app.momentFormat(v.create_time * 1000, 'YYYY年MM月DD日 HH:mm:ss')
            v.images = v.images ? v.images.split(',') : []
          }
          that.setData({
            lists: that.data.lists.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
          app.data.searchText = null
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onReachBottom () {
    if (this.data.more) {
      if (this.data.search) {
        this.getList(this.data.search)
      } else {
        this.getList()
      }
    } else app.setToast(this, {content: '没有更多内容啦'})
  },
  getCount () {
    let that = this
    app.wxrequest({
      url: app.getUrl().questionProblemMyCount,
      data: {
        user_id: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            hasInfo: res.data.data > 0 ? true : null
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onLoad () {
    this.getList()
  },
  onReady () {
    // TODO: onReady
  },
  onShow () {
    if (app.data.searchText) this.getList(app.data.searchText)
    this.getCount()
    // TODO: onShow
  },
  onHide () {
    // TODO: onHide
  },
  onUnload () {
    // TODO: onUnload
  },
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
