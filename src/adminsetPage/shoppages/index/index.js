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
    this.setData({
      [e.currentTarget.dataset.type]: e.detail.value
    })
  },
  btnclick (e) {
    if (e.currentTarget.dataset.type === 'cancel') {
      wx.navigateBack()
    } else {
      let that = this
      app.wxrequest({
        url: app.getUrl().setfinance,
        data: {
          mid: app.gs('shopInfoAll').id,
          phone: that.data.phone,
          wechat: that.data.wechat,
          roles: 1
        },
        success (res) {
          wx.hideLoading()
          if (res.data.status === 200) {
            wx.showToast({
              title: '设置成功',
              icon: 'success',
              mask: true
            })
          } else {
            app.setToast(that, {content: res.data.desc})
          }
        }
      })
    }
  },
  getfinance () {
    let that = this
    app.wxrequest({
      url: app.getUrl().finance,
      data: {
        mid: app.gs('shopInfoAll').id,
        roles: 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            phone: res.data.phone,
            wechat: res.data.wechat
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
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
    this.getfinance()
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
