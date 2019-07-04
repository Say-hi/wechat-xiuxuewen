// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_bg: '',
    systemVersion: app.data.systemVersion,
    img: app.data.testImg,
    erweima: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/publicy/qrcode_for_gh_66d80c7d342c_258.jpg',
    today: true
  },
  showImage () {
    let that = this
    app.wxrequest({
      url: app.getUrl().skip,
      data: {
        mid: app.gs('shopInfoAll').id,
        // mid: 10000,
        uid: that.data.info.id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (res.data.data.appid === 'wxb1f5224c98168afc ') {
            wx.navigateTo({
              url: `/webviewPage/shoppages/index/index?agents=${(that.data.agents || that.data.info.roles * 1 === 1) ? 1 : 2}&uid=${that.data.info.id}`
            })
          } else {
            wx.navigateToMiniProgram({
              appId: res.data.data.appid,
              path: `${res.data.data.path}?appid=${res.data.data.appid}&mid=${res.data.data.mid}&uid=${res.data.data.uid}`
            })
          }
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })

    // this.setData({
    //   showImage: !this.data.showImage
    // })
  },
  saveImage () {
    let that = this
    wx.showLoading({
      title: '图片保存中',
      mask: true
    })
    wx.downloadFile({
      url: that.data.erweima,
      success (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success () {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功'
            })
            that.showImage()
          },
          fail () {
            wx.hideLoading()
            wx.showModal({
              title: '保存失败',
              content: '请搜索公众号【焕颜季】',
              showCancel: false
            })
            that.showImage()
          }
        })
      }
    })
  },
  getUser () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        // uid: 10000
        uid: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.su('userInfoAll', res.data.data)
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
      today: e.currentTarget.dataset.type === 'today',
      move: this.data.move === 'rotatetab' ? 'null' : 'rotatetab'
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
