// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: app.data.testImg,
    today: true
  },
  shopUserReal (name) {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserReal,
      data: {
        uid: app.gs('userInfoAll').id,
        mall_rname: name
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.showToast({
            title: '修改完成'
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  inputName (e) {
    if (e.detail.value.length <= 0) return app.setToast(this, {content: '请输入内容'})
    if (this.data.options.type === 'user') {
      this.shopUserReal(e.detail.value)
    }
  },
  chooseDay (e) {
    this.setData({
      today: e.currentTarget.dataset.type === 'today'
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
  onLoad (options) {
    this.setData({
      options
    })
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
