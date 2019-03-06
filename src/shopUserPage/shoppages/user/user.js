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
            info: res.data.data,
            agents: res.data.data.mall_is > 0
          }, that.shopInfo)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  shopInfo () {
    let that = this
    if (!this.data.info.mall_id && !this.data.agents) return
    app.wxrequest({
      url: app.getUrl().shopInfo,
      data: {
        mid: that.data.agents ? that.data.info.id : that.data.info.mall_id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.su('shopInfoAll', res.data.data)
          that.setData({
            shopInfo: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  chooseDay (e) {
    this.setData({
      today: e.currentTarget.dataset.type === 'today'
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
  getUserInfoBtn (res) {
    if (res.detail.iv) app.wxlogin()
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
    this.getUser()
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
    this.getUser()
    // TODO: onPullDownRefresh
  }
})
