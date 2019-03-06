// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: app.data.testImg
  },
  upFormId (e) {
    app.upFormId(e)
  },
  inputValue (e) {
    console.log(e)
    this.setData({
      outMoney: e.detail.value * 1 >= this.data.profit ? this.data.profit * 1 : e.detail.value * 1
    })
  },
  shopUserCash () {
    let that = this
    if (!this.data.outMoney || this.data.outMoney < 1) return app.setToast(this, {content: '最小提现额度为1'})
    app.wxrequest({
      url: app.getUrl().shopUserCash,
      data: {
        uid: app.gs('userInfoAll').id,
        amount: that.data.outMoney
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.showToast({
            title: '提现成功'
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  shopUserFund () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserFund,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            profit: res.data.data.mall_total_fee
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  showScroll () {
    if (!this.data.ruler) {
      let that = this
      app.wxrequest({
        url: app.getUrl().shopUserExplain,
        data: {},
        success (res) {
          wx.hideLoading()
          if (res.data.status === 200) {
            app.WP('ruler', 'html', res.data.data.desc, that, 5)
          } else {
            app.setToast(that, {content: res.data.desc})
          }
        }
      })
    }
    this.setData({
      showS: !this.data.showS
    })
  },
  back () {
    wx.navigateBack()
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
  onLoad () {
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
    this.shopUserFund()
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
