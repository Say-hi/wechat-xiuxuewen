// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: app.data.testImg,
    labelIndex: 0
  },
  inputValue (e) {
    this.data.searchText = e.detail.value
  },
  getVideo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopVideoList,
      data: {},
      success (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.status === 200) {
          that.setData({
            list: res.data.data.lists
          }, that.getCategory)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  getCategory () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopCategoryList,
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            goodslabel: res.data.data
          }, that.getShopProduct)
          app.su('shopLabel', res.data.data)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  getShopProduct () {
    let that = this
    if (this.data.goodslabel[this.data.labelIndex].name === '搜索') return this.search()
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: 0,
        cid: that.data.goodslabel[that.data.labelIndex].id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            goods: res.data.data.lists
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  chooseLabel (e) {
    this.setData({
      goodslabel: this.data.goodslabel,
      labelIndex: e.currentTarget.dataset.index
    }, this.getShopProduct)
  },
  search () {
    let that = this
    if (!this.data.searchText || this.data.searchText.length <= 0) return app.setToast(this, {content: '请输入搜索的内容'})
    app.wxrequest({
      url: app.getUrl().shopProductList,
      data: {
        mid: 0,
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
  noUse () {
    app.noUse()
  },
  playVideo (e) {
    let that = this
    this.setData({
      play: !that.data.play,
      playIndex: e.currentTarget.dataset.index
    })
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
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin()
    this.getVideo()
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
    this.setData({
      move: !this.data.move
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    this.setData({
      move: !this.data.move
    })
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
    this.getVideo()
  }
})
