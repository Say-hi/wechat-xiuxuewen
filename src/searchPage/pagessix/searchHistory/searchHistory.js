// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyWord: [],
    searchShow: true
  },
  onShareAppMessage () {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: `/pages/index/index`,
      imageUrl: app.gs('shareText').g
    }
  },
  getKey () {
    let that = this
    app.wxrequest({
      url: app.getUrl().homeSearch,
      data: {},
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            keyWord: res.data.data[that.data.options.type]
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  cleanHistory () {
    this.setData({
      history: [],
      searchShow: false
    })
    if (this.data.options.type === 'goods') {
      wx.removeStorageSync('goodsHistory')
    } else {
      wx.removeStorageSync('articleHistory')
    }
  },
  chooseTip (e) {
    let index = e.currentTarget.dataset.choose
    if (e.currentTarget.dataset.type === 'key') {
      this.setData({
        keyWordIndex: index
      }, this.search(e.currentTarget.dataset.content))
    } else {
      this.setData({
        chooseHistory: index
      }, this.search(e.currentTarget.dataset.content))
    }
  },
  search (content) {
    let that = this
    let searcheText = ''
    if (content.detail) searcheText = content.detail.value
    else searcheText = content
    app.wxrequest({
      url: that.data.options.type === 'question' ? app.getUrl().question : that.data.options.type === 'store' ? app.getUrl().dotSearch : that.data.options.type === 'course' ? app.getUrl().courseSearch : that.data.options.type === 'offline' ? app.getUrl().activeSearch : '',
      data: Object.assign({
        page: 1
      }, that.data.options.type === 'question' ? {ask: searcheText} : that.data.options.type === 'store' ? {dot_name: searcheText} : (that.data.options.type === 'course' || that.data.options.type === 'offline') ? {title: searcheText} : {}),
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200 && res.data.data.total > 0) {
          app.data.searchText = searcheText
          setTimeout(() => {
            that.data.options.type === 'course' ? wx.navigateTo({
              url: '/coursePage/pageszero/course/course?type=search'
            }) : wx.navigateBack()
          }, 20)
        } else {
          app.setToast(that, {content: '未搜索到相关内容'})
        }
      }
    })
    // 设置缓存
    for (let index in that.data.history) {
      // 搜索项已经存在
      if (that.data.history[index] === searcheText) {
        that.setData({
          chooseHistory: index
        })
        return
      }
    }
    let history = that.data.history
    // console.log(history)
    if (!history) {
      history = [searcheText]
      that.data.history = history
    } else {
      let count = history.unshift(searcheText)
      if (count >= 10) {
        that.data.history.pop()
      }
    }
    this.setData({
      chooseHistory: 0,
      searchShow: true
    })
    // 执行搜索操作
    let type = that.data.options.type === 'goods' ? 'goodsHistory' : 'articleHistory'
    wx.setStorage({
      key: type,
      data: that.data.history,
      success () {
        that.setData({
          history: wx.getStorageSync(type)
        })
      }
    })
  },
  getHot () {
    let that = this
    app.wxrequest({
      url: app.getUrl().search,
      data: {},
      success (res) {
        wx.hideLaoding()
        if (res.data.status === 200) {

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
    app.setBar('搜索')
    let history = options.type === 'goods' ? app.gs('goodsHistory') : app.gs('articleHistory')
    if (!history) {
      this.setData({
        searchShow: false
      })
    }
    this.setData({
      options,
      history: history || []
    }, this.getKey)
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
