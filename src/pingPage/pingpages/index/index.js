// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  inputValue (e) {
    this.data.searchText = e.detail.value
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
  }
})
