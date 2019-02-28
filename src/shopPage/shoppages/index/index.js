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
          }, that.shopInfo)
          app.su('shopLabel', res.data.data)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  getShopProduct () {
    if (this.data.noshop) return
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
  shopInfo () {
    let that = this
    if (this.data.noshop) return
    app.wxrequest({
      url: app.getUrl().shopInfo,
      data: {
        mid: app.gs('shopInfo').mid || 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (!app.gs('shopInfoAll')) {
            app.su('shopInfoAll', res.data.data)
          }
          that.setData({
            info: res.data.data
          }, that.getShopProduct)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  upFormId (e) {
    app.upFormId(e)
  },
  noUse () {
    app.noUse()
  },
  playVideo (e) {
    let that = this
    if (e.currentTarget.dataset.index >= 0) app.videoCount(this.data.list[e.currentTarget.dataset.index].id)
    this.setData({
      play: !that.data.play,
      playIndex: e.currentTarget.dataset.index
    })
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
        path: `/shopPage/shoppages/index/index?mid=${that.data.id}`
      }
    }
  },
  getUser () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            userInfo: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  showTip () {
    wx.showModal({
      title: '未进入店铺',
      content: '请扫码店主的【小程序码】或通过店主的【小程序分享】进入',
      showCancel: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (!app.gs('shopInfo').mid) {
      app.su('shopInfo', options)
      if (!app.gs('shopInfo').mid) {
        this.setData({
          noshop: true
        }, this.getUser)
      } else {
        this.setData({
          noshop: false
        })
      }
    }
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin()
    this.getVideo()
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
